import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ObjectMap} from '@tk-ui/others/types';

/**
 * Options for IndexedDB.
 */
export interface IDBOptions {
  /**
   * Database name.
   */
  name: string;

  /**
   * Database version.
   */
  version?: number;

  /**
   * Define stores of database.
   */
  stores: IDBStoreOptions[];
}

/**
 * Options for ObjectStore.
 */
export interface IDBStoreOptions<T = any> {
  /**
   * Name of store.
   */
  name: string;

  /**
   * Key path.
   */
  keyPath?: keyof T | (keyof T)[];

  /**
   * State of auto increment of key path.
   */
  autoIncrement?: boolean;

  /**
   * Define indexes of store.
   */
  indexes?: IDBIndexOptions<T>[];

  /**
   * Set upgrade handler when upgrade is needed.
   * @param data - Previous stored data need to be changed.
   */
  onUpgrade?: <T>(data: T[]) => T[];
}

/**
 * Options for index of ObjectStore.
 */
export interface IDBIndexOptions<T = any> {
  /**
   * Name of index.
   */
  name: string;

  /**
   * Key path.
   */
  keyPath: keyof T | (keyof T)[];

  /**
   * See: https://developer.mozilla.org/en-US/docs/Web/API/IDBIndex/multiEntry
   */
  multiEntry?: boolean;

  /**
   * State of unique or not.
   */
  unique?: boolean;
}

/**
 * Map the DOMStringList.
 * @param list - DOMStringList.
 */
function mapDomStringList(list: DOMStringList): ObjectMap<boolean> {
  const map: ObjectMap<boolean> = {};
  const length = list.length;

  for (let i = 0; i < length; i++) {
    const index = list.item(i);

    if (index) {
      map[index] = true;
    }
  }

  return map;
}

/**
 * Service to manage IndexedDB.
 * To start with this, call `init()` and `connect()` when the application started.
 */
@Injectable({
  providedIn: 'root'
})
export class IdbService {
  /**
   * `BehaviorSubject` for database instance.
   */
  private _db$ = new BehaviorSubject<IdbDatabase | null>(null);

  /**
   * Get `IdbDatabase` as observable.
   */
  get db$(): Observable<IdbDatabase | null> {
    return this._db$.asObservable();
  }

  /**
   * Get `IdbDatabase`.
   */
  get db(): IdbDatabase | null {
    return this._db$.value;
  }

  /**
   * Initialize the IndexedDB.
   * @param options - Options to init database.
   */
  init(options: IDBOptions): Promise<IDBDatabase> {
    const request: IDBOpenDBRequest = indexedDB.open(options.name, options.version);

    return new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);

      // Handle upgrade.
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        this._upgradeDb(event, request.result, options)
          .then(() => {
            resolve(request.result);
          })
          .catch((err) => {
            reject(err);
          });
      };
    });
  }

  /**
   * Connect to indexed db with database name.
   * It always returns the latest version of db and doesn't handle any upgrades.
   * After the database connected, `IdbDatabase` will be set to `_db$`.
   * @param name - Database name.
   */
  connect(name: string): Promise<IDBDatabase> {
    const request: IDBOpenDBRequest = indexedDB.open(name);

    return new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => {
        this._db$.next(new IdbDatabase(request.result));
        resolve(request.result);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Create new object store and return it.
   * @param db - Instance of database.
   * @param config - Store configuration.
   */
  createStore<T>(db: IDBDatabase, config: IDBStoreOptions<T>): IDBObjectStore {
    const {name, keyPath, autoIncrement, indexes} = config;

    const store = db.createObjectStore(name, {
      keyPath: keyPath as any,
      autoIncrement: autoIncrement,
    });

    this._createStoreIndices(store, indexes);

    return store;
  }

  /**
   * Upgrade db with configuration when needed.
   * @param event - Version change event of database.
   * @param db - Instance of database.
   * @param config - Database configuration.
   */
  private async _upgradeDb(event: IDBVersionChangeEvent, db: IDBDatabase, config: IDBOptions): Promise<void> {
    const storeMap = mapDomStringList(db.objectStoreNames);

    for (let i = 0; i < config.stores.length; i++) {
      const storeConfig = config.stores[i];
      const {name} = storeConfig;

      // Delete store to update from map.
      // The unused stores will be deleted at last.
      if (storeMap[name]) {
        delete storeMap[name];

        const previousStore = (event.target as IDBOpenDBRequest).transaction?.objectStore(name);

        if (previousStore) {
          let previousData = await this._getAllPreviousData(previousStore);

          // Delete existing one to update from here after saving previous data.
          db.deleteObjectStore(name);

          // If there is `onUpgrade()` callback,
          // call this callback to modify previous data according to new version.
          if (storeConfig.onUpgrade) {
            previousData = storeConfig.onUpgrade(previousData);
          }

          // Create new store.
          const newStore = this.createStore(db, storeConfig);

          // Restore all previous data and remove unused stores.
          await this._restoreAllData(newStore, previousData);
          this._removeUnusedStores(db, storeMap);
        }
      } else {
        // Just create new store if previous store not exists.
        this.createStore(db, storeConfig);
      }
    }
  }

  /**
   * Get all previous data to restore after re-creating object store.
   * @param store - Instance of previous object store.
   */
  private _getAllPreviousData<T>(store: IDBObjectStore): Promise<T[]> {
    const request = store.getAll();

    return new Promise<T[]>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Restore previous data to newly created object store.
   * @param store - Instance of new object store.
   * @param data - Previous data which need to be restored.
   */
  private async _restoreAllData(store: IDBObjectStore, data: any[]): Promise<void> {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      await new Promise<void>((resolve, reject) => {
        const request = store.add(item);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  /**
   * Remove unused stores from indexed db.
   * @param db - Instance of database.
   * @param map - The map of unused stores.
   */
  private _removeUnusedStores(db: IDBDatabase, map: ObjectMap<boolean>): void {
    Object.keys(map).forEach(key => {
      db.deleteObjectStore(key);
    });
  }

  /**
   * Create indexes for object store.
   * @param store - Instance of store.
   * @param indexes - Store configuration.
   */
  private _createStoreIndices(store: IDBObjectStore, indexes: IDBIndexOptions[] = []): void {
    const indexMap = mapDomStringList(store.indexNames);

    indexes.forEach(indexConfig => {
      const {name, keyPath, unique, multiEntry} = indexConfig;

      // Delete index to update from map.
      // The unused indexes will be deleted at last.
      if (indexMap[name]) {
        delete indexMap[name];

        // Delete previous index.
        store.deleteIndex(name);
      }

      store.createIndex(name, keyPath as any, {
        unique: unique || false,
        multiEntry: multiEntry || false,
      });
    });

    // Remove remaining indexes those are not using.
    this._removeUnusedIndices(store, indexMap);
  }

  /**
   * Remove unused indexes from object store.
   * @param store - Instance of store.
   * @param map - The map of unused indexes.
   */
  private _removeUnusedIndices(store: IDBObjectStore, map: ObjectMap<boolean>): void {
    Object.keys(map).forEach(key => {
      store.deleteIndex(key);
    });
  }
}

/**
 * Wrapper class of `IDBDatabase`.
 */
export class IdbDatabase {
  /**
   * Database instance.
   */
  private _database: IDBDatabase;

  constructor(database: IDBDatabase) {
    this._database = database;
  }

  /**
   * Get `IdbTransaction`.
   * @param names - Store names to start transaction.
   * @param mode - Access mode of transaction.
   */
  getTransaction(names: string | string[], mode?: IDBTransactionMode): IdbTransaction {
    const transaction = this._database.transaction(names, mode);

    return new IdbTransaction(transaction);
  }
}

/**
 * Wrapper class of `IDBIndex`.
 */
export class IdbIndex<T> {
  /**
   * Instance of index.
   */
  private _index: IDBIndex;

  constructor(index: IDBIndex) {
    this._index = index;
  }

  /**
   * Get single data with key.
   * @param key - The `keyPath` of data.
   */
  get<T>(key: IDBValidKey | IDBKeyRange): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const request = this._index.get(key);

      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all data in store.
   */
  getAll<T>(): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      const request = this._index.getAll();

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }
}

/**
 * Wrapper class for `IDBObjectStore`.
 */
export class IdbStore<T> {
  /**
   * Instance of object store.
   */
  private _store: IDBObjectStore;

  constructor(store: IDBObjectStore) {
    this._store = store;
  }

  /**
   * Get index from store.
   * @param name - Name of index.
   */
  getIndex(name: string): IdbIndex<T> {
    const index = this._store.index(name);

    return new IdbIndex(index);
  }

  /**
   * Add data to store.
   * @param data - Data to add.
   */
  async add(data: T | T[]): Promise<IDBValidKey> {
    const results: IDBValidKey = [];

    // Make data as an Array.
    data = data instanceof Array ? data : [data];

    // Loop with `for` statement to persist the order of items.
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const result = await new Promise<IDBValidKey>((resolve, reject) => {
        const request = this._store.add(item);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      results.push(result);
    }

    return results;
  }

  /**
   * Update existing data with its key.
   * @param data - Data to update.
   * @param key - The `keyPath` of data.
   */
  put(data: T, key?: IDBValidKey): Promise<IDBValidKey> {
    return new Promise<IDBValidKey>((resolve, reject) => {
      const request = this._store.put(data, key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete data with key.
   * @param key - The `keyPath` of data.
   */
  delete(key: IDBValidKey | IDBKeyRange): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = this._store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get single data with key.
   * @param key - The `keyPath` of data.
   */
  get(key: IDBValidKey | IDBKeyRange): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const request = this._store.get(key);

      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all data in store.
   */
  getAll(): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      const request = this._store.getAll();

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }
}

/**
 * Wrapper class of `IDBTransaction`.
 */
export class IdbTransaction {
  /**
   * Transaction instance.
   */
  private _transaction: IDBTransaction;

  constructor(transaction: IDBTransaction) {
    this._transaction = transaction;
  }

  /**
   * Commit transaction.
   */
  commit(): void {
    this._transaction.commit();
  }

  /**
   * Abort transaction.
   */
  abort(): void {
    this._transaction.abort();
  }

  /**
   * Get store by name.
   * @param name - Name of store.
   */
  getStore<T>(name: string): IdbStore<T> {
    const store = this._transaction.objectStore(name);

    return new IdbStore(store);
  }
}
