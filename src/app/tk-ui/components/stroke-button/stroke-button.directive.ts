import {Directive, ElementRef, HostBinding, Input, Renderer2, ViewContainerRef} from '@angular/core';
import {RippleColor, RippleDirective} from '@tk-ui/components/ripple/ripple.directive';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';

/**
 * Available colors for stroke button.
 */
export type StrokeButtonColor = '';

/**
 * Directive to style stroke button.
 */
@Directive({
  selector: '[appStrokeButton]'
})
export class StrokeButtonDirective extends RippleDirective {
  /**
   * Bind button class.
   */
  @HostBinding('class.tk-stroke-button') buttonClass = true;

  /**
   * Set and bind the color for stroke button.
   */
  @Input() @HostBinding('attr.tk-color') color: StrokeButtonColor = '';

  constructor(
    protected override renderer: Renderer2,
    protected override elementRef: ElementRef<HTMLElement>,
    protected override viewContainerRef: ViewContainerRef,
    protected override subscriptionService: SubscriptionService,
  ) {
    super(renderer, elementRef, viewContainerRef, subscriptionService);
  }

  /**
   * Override `rippleColor` getter to set ripple color according to the button color.
   */
  override get rippleColor(): RippleColor {
    return super.rippleColor;
  }
}
