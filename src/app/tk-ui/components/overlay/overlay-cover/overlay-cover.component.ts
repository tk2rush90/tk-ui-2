import {Component, ElementRef, HostListener, Inject} from '@angular/core';
import {OverlayProviders, OverlayService} from '@tk-ui/components/overlay/overlay.service';

/**
 * The overlay cover can clear the overlay.
 */
@Component({
  selector: 'app-overlay-cover',
  templateUrl: './overlay-cover.component.html',
  styleUrls: ['./overlay-cover.component.scss'],
})
export class OverlayCoverComponent {

  constructor(
    @Inject(OverlayProviders.id) private id: string,
    private elementRef: ElementRef<HTMLElement>,
    private overlayService: OverlayService,
  ) { }

  /**
   * Call clear overlay with its id.
   */
  @HostListener('click')
  onHostPointerDown(): void {
    this.overlayService.clearOverlay(this.id);
  }
}
