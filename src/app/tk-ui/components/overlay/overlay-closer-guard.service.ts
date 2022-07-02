import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {ModalService} from '@tk-ui/components/modal/modal.service';
import {OverlayService} from '@tk-ui/components/overlay/overlay.service';

/**
 * This guard can be provided to the router.
 * It will prevent page move when modal is opened in the router.
 */
@Injectable({
  providedIn: 'root'
})
export class OverlayCloserGuard implements CanDeactivate<unknown> {
  constructor(
    private _router: Router,
    private _modalService: ModalService,
    private _overlayService: OverlayService,
  ) {
  }

  /**
   * If there are some opened modal when trying to deactivate the router,
   * close latest modal first and prevent routing.
   * @param component - The current component.
   * @param currentRoute - The current `ActivatedRouteSnapshot`.
   * @param currentState - The current `RouterStateSnapshot`.
   * @param nextState - The next `RouterStateSnapshot`.
   */
  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const hasOpenedModals = this._modalService.hasOpenedModals;
    const hasOpenedOverlays = this._overlayService.hasOpenedOverlays;

    if (hasOpenedModals) {
      this._modalService.closeLatest(true);
    } else if (hasOpenedOverlays) {
      this._overlayService.closeLatest();
    }

    if (hasOpenedModals || hasOpenedOverlays) {
      this._router.navigateByUrl(currentState.url);
    }

    return !hasOpenedModals;
  }
}
