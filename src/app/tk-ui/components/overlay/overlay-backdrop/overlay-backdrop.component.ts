import {Component, HostListener, Inject} from '@angular/core';
import {OVERLAY_REF, OverlayRef} from '@tk-ui/components/overlay/overlay.service';

/**
 * The backdrop of overlay.
 */
@Component({
  selector: 'app-overlay-backdrop',
  templateUrl: './overlay-backdrop.component.html',
  styleUrls: ['./overlay-backdrop.component.scss'],
})
export class OverlayBackdropComponent {
  constructor(
    @Inject(OVERLAY_REF) private _overlayRef: OverlayRef<any>,
  ) {
  }

  /**
   * Listen `click` event to close overlay.
   */
  @HostListener('click')
  onHostClick(): void {
    this._overlayRef.close();
  }
}
