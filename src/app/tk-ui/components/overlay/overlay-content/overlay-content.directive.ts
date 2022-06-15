import {Directive, ElementRef, HostListener, Inject} from '@angular/core';
import {EventListenerService} from '@tk-ui/services/common/event-listener.service';
import {OVERLAY_REF, OverlayRef} from '@tk-ui/components/overlay/overlay.service';

/**
 * The `OverContent` should be implemented to a Component which should be drawn in overlay.
 * When extending this class, please provide `EventListenerService` to extending class.
 */
@Directive({
  selector: '[appOverlayContent]',
  providers: [
    EventListenerService,
  ],
})
export class OverlayContent {
  constructor(
    @Inject(OVERLAY_REF) protected _overlayRef: OverlayRef<any>,
    protected _elementRef: ElementRef<HTMLElement>,
    protected _eventListenerService: EventListenerService,
  ) { }

  /**
   * Get host element.
   */
  get element(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  /**
   * Clear the overlay when window resized.
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    this._overlayRef.close();
  }
}
