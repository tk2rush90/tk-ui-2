import {AfterViewInit, Directive, ElementRef, HostListener, Inject} from '@angular/core';
import {EventListenerService} from '@tk-ui/services/common/event-listener.service';
import {OverlayProviders, OverlayService} from '@tk-ui/components/overlay/overlay.service';

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
export class OverlayContent implements AfterViewInit {

  constructor(
    @Inject(OverlayProviders.id) protected id: string,
    protected elementRef: ElementRef<HTMLElement>,
    protected overlayService: OverlayService,
    protected eventListenerService: EventListenerService,
  ) { }

  ngAfterViewInit(): void {
    this._detectScrollableContainerScroll();
  }

  /**
   * Get host element.
   */
  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  /**
   * Clear the overlay when window resized.
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    this.overlayService.clearOverlay(this.id);
  }

  /**
   * Make every scrollable container should close the options when scrolled.
   */
  protected _detectScrollableContainerScroll(): void {
    let parent = this.element.parentElement;

    while (parent) {
      // The container which is scrollable should detect the scroll event.
      if (
        parent.scrollHeight > parent.offsetHeight
        || parent.scrollWidth > parent.offsetWidth
      ) {
        this._addScrollEventHandler(parent);
      }

      // Lookup next parent.
      parent = parent.parentElement;
    }

    // The `window` also can cloe the overlay.
    this._addScrollEventHandler(window);
  }

  /**
   * Add scroll event handler to target.
   * @param target - The `EventTarget`.
   */
  protected _addScrollEventHandler(target: EventTarget): void {
    this.eventListenerService.addEvent(target, 'scroll', () => {
      this.overlayService.clearOverlay(this.id);
    });
  }
}
