import {Directive, ElementRef, HostBinding, Input, Renderer2, ViewContainerRef} from '@angular/core';
import {RippleColor, RippleDirective} from '@tk-ui/components/ripple/ripple.directive';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';

/**
 * Available colors for flat button.
 */
export type FlatButtonColor = '';

/**
 * Directive to style flat button.
 */
@Directive({
  selector: '[appFlatButton]'
})
export class FlatButtonDirective extends RippleDirective {
  /**
   * Bind button class.
   */
  @HostBinding('class.tk-flat-button') buttonClass = true;

  /**
   * Set and bind the color for flat button.
   */
  @Input() @HostBinding('attr.tk-color') color: FlatButtonColor = '';

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
