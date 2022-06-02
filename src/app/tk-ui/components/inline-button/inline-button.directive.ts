import {Directive, HostBinding, Input} from '@angular/core';

/**
 * Available colors for inline button.
 */
export type InlineButtonColor = '';

/**
 * Directive to style inline button.
 */
@Directive({
  selector: '[appInlineButton]'
})
export class InlineButtonDirective {
  /**
   * Bind button class.
   */
  @HostBinding('class.tk-inline-button') buttonClass = true;

  /**
   * Set and bind the color for inline button.
   */
  @Input() @HostBinding('attr.tk-color') color: InlineButtonColor = '';
}
