import {Injectable} from '@angular/core';
import {CanDeactivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {ModalService} from '@tk-ui/components/modal/modal.service';

/**
 * This guard can be provided to the router.
 * It will prevent page move when modal is opened in the router.
 */
@Injectable({
  providedIn: 'root'
})
export class ModalCloserGuard implements CanDeactivate<unknown> {
  constructor(
    private router: Router,
    private modalService: ModalService,
  ) {
  }

  /**
   * If there are some opened modal when trying to deactivate the router,
   * close latest modal first and prevent routing.
   * @param currentState - The current `RouterStateSnapshot`.
   */
  canDeactivate(currentState: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const hasOpenedModal = this.modalService.hasOpenedModal;

    if (hasOpenedModal) {
      this.modalService.closeLatest();
      this.router.navigateByUrl(currentState.url);
    }

    return !hasOpenedModal;
  }
}
