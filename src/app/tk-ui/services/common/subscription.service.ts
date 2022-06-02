import {Injectable, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

/**
 * Service to manage subscriptions.
 * This to be injected explicitly with `providers` of `Component` or `NgModule`.
 */
@Injectable()
export class SubscriptionService implements OnDestroy {
  /**
   * Storage for stored subscriptions.
   */
  private storage: {[key: string]: Subscription | Subscription[]} = {};

  ngOnDestroy(): void {
    this.unSubscribeAll();
  }

  /**
   * Wrapper method for observable.
   * @param key - Identifier key.
   * @param item - Subscription or subscriptions.
   */
  store(key: string, item: Subscription | Subscription[]): void {
    // Unsubscribe before store.
    this.unSubscribe(key);
    this.storage[key] = item;
  }

  /**
   * Append subscription to store.
   * @param key - Identifier key.
   * @param item - Subscription or subscriptions.
   */
  append(key: string, item: Subscription | Subscription[]): void {
    if (!this.storage[key]) {
      this.storage[key] = [];
    }

    if (item instanceof Array) {
      (this.storage[key] as Subscription[]).push(...item);
    } else {
      (this.storage[key] as Subscription[]).push(item);
    }
  }

  /**
   * Unsubscribe item by key.
   * @param key - Identifier key.
   */
  unSubscribe(key: string): void {
    const item = this.storage[key];

    if (item) {
      (item instanceof Array ? item : [item]).forEach(sub => sub.unsubscribe());
      delete this.storage[key];
    }
  }

  /**
   * Unsubscribe all items.
   */
  unSubscribeAll(): void {
    Object.keys(this.storage).forEach(key => this.unSubscribe(key));
  }
}
