import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  /**
   * Set data to local storage.
   * @param key - Key.
   * @param data - Data.
   */
  setToLocal<T>(key: string, data: T): void {
    const json = JSON.stringify(data);

    localStorage.setItem(key, json);
  }

  /**
   * Get data from local storage
   * @param key - Key.
   */
  getFromLocal<T>(key: string): T | undefined {
    const json = localStorage.getItem(key);

    if (json) {
      return JSON.parse(json) as T;
    } else {
      return;
    }
  }

  /**
   * Remove the item from local storage.
   * @param key - The key.
   */
  removeFromLocal(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Set data to session storage
   * @param key - Key.
   * @param data - Data.
   */
  setToSession<T>(key: string, data: T): void {
    const json = JSON.stringify(data);

    sessionStorage.setItem(key, json);
  }

  /**
   * Get data from session storage
   * @param key - Key.
   */
  getFromSession<T>(key: string): T | undefined {
    const json = sessionStorage.getItem(key);

    if (json) {
      return JSON.parse(json) as T;
    } else {
      return;
    }
  }

  /**
   * Remove the item from session storage.
   * @param key - The key.
   */
  removeFromSession(key: string): void {
    sessionStorage.removeItem(key);
  }
}
