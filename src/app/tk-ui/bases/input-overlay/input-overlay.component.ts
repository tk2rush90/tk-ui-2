import {Component, ElementRef, HostBinding, HostListener, Inject} from '@angular/core';
import {OverlayContent} from '@tk-ui/components/overlay/overlay-content/overlay-content.directive';
import {OverlayProviders, OverlayService} from '@tk-ui/components/overlay/overlay.service';
import {EventListenerService} from '@tk-ui/services/common/event-listener.service';
import {SHOW_DOWN_ANIMATION_NAME, showDownAnimation, ShowDownState} from '@tk-ui/animations/show-down';
import {SHOW_UP_ANIMATION_NAME, showUpAnimation, ShowUpState} from '@tk-ui/animations/show-up';
import {AnimationEvent} from '@angular/animations';

/**
 * The required data interface for input overlay.
 */
export interface InputOverlayData {
  /**
   * The button element to calculate position of overlay.
   */
  button: HTMLElement;
}

/**
 * This is base class of overlay component which can be opened by input-like element like select, datepicker.
 * Do not try to render this component directly into view.
 */
@Component({
  selector: 'app-input-overlay',
  template: '',
  providers: [
    EventListenerService,
  ],
  animations: [
    showDownAnimation,
    showUpAnimation,
  ],
})
export class InputOverlay extends OverlayContent {
  /**
   * Show down animation state.
   */
  @HostBinding(`@${SHOW_DOWN_ANIMATION_NAME}`) showDown = ShowDownState.void;

  /**
   * Show up animation state.
   */
  @HostBinding(`@${SHOW_UP_ANIMATION_NAME}`) showUp = ShowUpState.void;

  /**
   * The component ready state.
   * User can't do any mouse actions when this value is `false`.
   */
  protected _ready = false;

  /**
   * The `x` position.
   */
  protected _x = 0;

  /**
   * The `y` position.
   */
  protected _y = 0;

  /**
   * By default, the input overlay will be rendered under the select button.
   * But, if it needs to be rendered on the above of the select button, set this value to `true`.
   * Different animation will be animated according to this value.
   */
  protected _reversed = false;

  constructor(
    @Inject(OverlayProviders.id) protected override id: string,
    @Inject(OverlayProviders.data) protected data: InputOverlayData,
    protected override elementRef: ElementRef<HTMLElement>,
    protected override overlayService: OverlayService,
    protected override eventListenerService: EventListenerService,
  ) {
    super(id, elementRef, overlayService, eventListenerService);
  }

  /**
   * Bind `pointer-events` style attribute by `_ready` state.
   */
  @HostBinding('style.pointer-events')
  get pointerEvents(): string {
    return this._ready ? 'all' : 'none';
  }

  /**
   * Bind left style.
   */
  @HostBinding('style.left')
  get left(): string {
    return `${this._x}px`;
  }

  /**
   * Bind top style.
   */
  @HostBinding('style.top')
  get top(): string {
    return `${this._y}px`;
  }

  /**
   * Detect show down done to set component as ready.
   * @param event - The `AnimationEvent`.
   */
  @HostListener(`@${SHOW_DOWN_ANIMATION_NAME}.done`, ['$event'])
  onHostShowDownDone(event: AnimationEvent): void {
    if (event.fromState === 'void' && event.toState === 'show') {
      this._ready = true;
    }
  }

  /**
   * Detect show up done to set component as ready.
   * @param event - The `AnimationEvent`.
   */
  @HostListener(`@${SHOW_UP_ANIMATION_NAME}.done`, ['$event'])
  onHostShowUpDone(event: AnimationEvent): void {
    if (event.fromState === 'void' && event.toState === 'show') {
      this._ready = true;
    }
  }

  /**
   * Trigger proper animation according to `reversed` state.
   */
  protected _startAnimation(): void {
    if (this._reversed) {
      this.showUp = ShowUpState.show;
    } else {
      this.showDown = ShowDownState.show;
    }
  }

  /**
   * Calculate the `y` position of this overlay by comparing `buttonRect`.
   * @param buttonRect - The `DOMRect` of button.
   * @param elementRect - The `DOMRect` of current overlay component.
   */
  protected _calculateYPosition(buttonRect: DOMRect, elementRect: DOMRect): void {
    if (
      // If button bottom + overlay heights is bigger than window height,
      // and button top - overlay heights is bigger than `0`.
      // In other words, bottom space not available, but top space is available.
      buttonRect.bottom + elementRect.height > window.innerHeight
      && buttonRect.y - elementRect.height > 0
    ) {
      this._y = buttonRect.y - elementRect.height;
    } else {
      this._y = buttonRect.bottom;
    }

    // State whether the overlay displaying position is reversed or not.
    // By default, the overlay should be shown on the bottom of the select component.
    // But, if it's reversed, show on top, and that means the `y` position of this overlay
    // is not same with `bottom` of select component.
    this._reversed = buttonRect.bottom !== this._y;
  }
}
