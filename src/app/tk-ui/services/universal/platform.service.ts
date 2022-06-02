import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';

/**
 * Created to remove the discomfort of injecting `PLATFORM_ID` to component.
 */
@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  /**
   * Get the state of whether platform is browser or not.
   */
  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Get the state of whether platform is server or not.
   */
  get isServer(): boolean {
    return isPlatformServer(this.platformId);
  }
}
