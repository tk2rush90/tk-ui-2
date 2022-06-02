import {
  ComponentRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import {RippleComponent} from '@tk-ui/components/ripple/ripple.component';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {ParsingUtil} from '@tk-ui/utils/parsing.util';


/**
 * The ripple color.
 * Default is `black`.
 */
export type RippleColor = 'black' | 'white';

/**
 * Ripple directive to create an interactive ripple to component.
 */
@Directive({
  selector: '[appRipple]',
  providers: [
    SubscriptionService,
  ],
})
export class RippleDirective {
  /**
   * Set ripple bound state.
   * If `false`, ripple can be spread to the outer of the component.
   */
  @Input() @HostBinding('class.tk-ripple-bound') bound = true;

  /**
   * Bind ripple container class.
   */
  @HostBinding('class.tk-ripple') class = true;

  /**
   * Created ripples array.
   */
  ripples: ComponentRef<RippleComponent>[] = [];

  /**
   * Ripple color.
   */
  private _rippleColor: RippleColor = 'black';

  /**
   * Set true when ripple need to be started from the center.
   */
  private _centered = false;

  constructor(
    protected renderer: Renderer2,
    protected elementRef: ElementRef<HTMLElement>,
    protected viewContainerRef: ViewContainerRef,
    protected subscriptionService: SubscriptionService,
  ) {
  }

  /**
   * Set ripple color.
   * @param rippleColor - Ripple color.
   */
  @Input()
  set rippleColor(rippleColor: RippleColor) {
    this._rippleColor = rippleColor;
  }

  /**
   * Set centered state.
   * @param centered - Centered state.
   */
  @Input()
  set centered(centered: boolean) {
    this._centered = centered;
  }

  /**
   * Get the state of ripple color whether black or not and bind to class.
   */
  @HostBinding('class.tk-ripple-black')
  get rippleBlack(): boolean {
    return this.rippleColor === 'black';
  }

  /**
   * Get the state of ripple color whether white or not and bind to class.
   */
  @HostBinding('class.tk-ripple-white')
  get rippleWhite(): boolean {
    return this.rippleColor === 'white';
  }

  /**
   * Get ripple color.
   */
  get rippleColor(): RippleColor {
    return this._rippleColor;
  }

  /**
   * Get centered state.
   */
  get centered(): boolean {
    return this._centered;
  }

  /**
   * Get host element.
   */
  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  /**
   * Get value of border left.
   */
  get borderLeft(): number {
    return this._getBorderStyleValue('border-left-width');
  }

  /**
   * Get value of border top.
   */
  get borderTop(): number {
    return this._getBorderStyleValue('border-top-width');
  }

  /**
   * Get value of border right.
   */
  get borderRight(): number {
    return this._getBorderStyleValue('border-right-width');
  }

  /**
   * Get value of border bottom.
   */
  get borderBottom(): number {
    return this._getBorderStyleValue('border-bottom-width');
  }

  /**
   * Handle host pointer down event.
   * @param event - Event.
   */
  @HostListener('pointerdown', ['$event'])
  onHostPointerDown(event: PointerEvent): void {
    this.addRipple(event);
  }

  /**
   * Handle window pointer up event.
   */
  @HostListener('window:pointerup')
  onWindowPointerUp(): void {
    this.setRippleDestroyable();
  }

  /**
   * Handle host pointer out event.
   */
  @HostListener('pointerout')
  onHostPointerOut(): void {
    this.setRippleDestroyable();
  }

  /**
   * Add ripple to host element.
   * @param event - The event to calculate the position.
   */
  addRipple(event: PointerEvent): void {
    const domRect = this.element.getBoundingClientRect();
    const ripple = this.viewContainerRef.createComponent(RippleComponent);
    let rx: number;
    let ry: number;

    if (this.centered) {
      const borderLeft = this.borderLeft;
      const borderTop = this.borderTop;
      const borderRight = this.borderRight;
      const borderBottom = this.borderBottom;

      rx = (domRect.width - (borderLeft + borderRight)) / 2;
      ry = (domRect.height - (borderTop + borderBottom)) / 2;
    } else {
      // If ripple is not starts from the center of element, event is required to calculate the position.
      rx = event.x - domRect.x;
      ry = event.y - domRect.y;
    }

    this.ripples.push(ripple);

    ripple.instance.x = rx;
    ripple.instance.y = ry;
    ripple.instance.size = Math.max(domRect.width, domRect.height);
    ripple.changeDetectorRef.detectChanges();

    this.renderer.appendChild(this.element, ripple.location.nativeElement);

    this._subscribeRippleDestroy(ripple);
  }

  /**
   * Set the oldest ripple to be destroyable.
   */
  setRippleDestroyable(): void {
    const ripple = this.ripples.shift();

    if (ripple) {
      ripple.instance.setDestroyable();
    }
  }

  /**
   * Get the numeric value for border style.
   * @param style - The style name to get border.
   */
  private _getBorderStyleValue(style: 'border-left-width' | 'border-top-width' | 'border-right-width' | 'border-bottom-width'): number {
    const value = getComputedStyle(this.element).getPropertyValue(style);

    return ParsingUtil.toFloat(value.replace('px', ''));
  }

  /**
   * Subscribe the ripple destroy emitter to destroy it.
   * @param ripple - Ripple component reference.
   */
  private _subscribeRippleDestroy(ripple: ComponentRef<RippleComponent>): void {
    const sub = ripple.instance.destroy.subscribe(() => ripple.destroy());

    this.subscriptionService.store(`_subscribeRippleDestroy${ripple.instance.id}`, sub);
  }
}
