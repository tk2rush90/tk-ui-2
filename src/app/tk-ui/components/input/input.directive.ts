import {Directive, ElementRef, HostBinding, HostListener, Input, Optional, Self} from '@angular/core';
import {CustomFormControl} from '@tk-ui/bases/custom-form-control/custom-form-control.directive';
import {NgControl} from '@angular/forms';
import {ValidationUtil} from '@tk-ui/utils/validation.util';
import {ParsingUtil} from '@tk-ui/utils/parsing.util';

export type InputControlType =
  'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-locale'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

export type MaskFunction = (value: string) => string;

/**
 * Styled input `FormControl`.
 */
@Directive({
  selector: 'input[appInput], textarea[appInput]'
})
export class InputDirective extends CustomFormControl<string> {
  /**
   * Set max value.
   * Only works for input element with `'number'` type.
   */
  @Input() max: number | undefined;

  /**
   * Set min value.
   * Only works for input element with `'number'` type.
   */
  @Input() min: number | undefined;

  /**
   * Set base class for input `FormControl`.
   */
  @HostBinding('class.tk-input') baseClass = true;

  /**
   * Set type.
   * Only works for input element.
   */
  @Input() @HostBinding('attr.type') type: InputControlType = 'text';

  /**
   * Set `spellcheck` attribute.
   */
  @Input() @HostBinding('attr.spellcheck') spellcheck = false;

  /**
   * Set `autocomplete` attribute.
   */
  @Input() @HostBinding('attr.autocomplete') autocomplete = 'off';

  /**
   * Set placeholder.
   * Only works for input element.
   */
  @Input() @HostBinding('attr.placeholder') placeholder = '';

  /**
   * Set disabled class.
   * Using class is to show input's style according to its class from the parent component.
   */
  @Input() @HostBinding('class.tk-disabled') disabled = false;

  /**
   * Set focused class.
   * Using class is to show input's style according to its class from the parent component.
   */
  @Input() @HostBinding('class.tk-focused') focused = false;

  /**
   * Mask function for input.
   */
  @Input() maskFunction?: MaskFunction;

  /**
   * Input value.
   */
  value = '';

  constructor(
    @Self() @Optional() public override ngControl: NgControl,
    private elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    super(ngControl);
  }

  /**
   * Get host element.
   */
  get element(): HTMLInputElement | HTMLTextAreaElement {
    return this.elementRef.nativeElement;
  }

  /**
   * Write value to input or textarea.
   * @param value - The value.
   */
  override writeValue(value: string): void {
    this.value = value;
    this.element.value = value;
  }

  /**
   * Toggle disabled state of input element.
   * @param isDisabled - Disabled state.
   */
  override setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.element.disabled = isDisabled;
  }

  /**
   * Override `setValue()` method to mask user input.
   * @param value - The value to mask.
   */
  override setValue(value: string) {
    if (this.maskFunction) {
      value = this.maskFunction(value);
    }

    super.setValue(value);
  }

  /**
   * Listen host `input` event to update the value.
   */
  @HostListener('input', ['$event'])
  onHostInput(event: InputEvent): void {
    // Use `switch` statement since there can be more cases.
    switch (this.type) {
      case 'number': {
        // By default, the negative sign of `'number'` type field is not allowed to `NgControl`.
        // So, when the negative sign is typed, prevent updating the value
        // when the input element doesn't have any value.
        // This makes you can see the negative sign from the browser,
        // but real value of input element will be an empty string.
        if (event.data === '-') {
          if (this.element.value) {
            this.setValue(this.element.value);
          }
        } else {
          this.setValue(this.element.value);
        }

        break;
      }

      default: {
        this.setValue(this.element.value);
      }
    }
  }

  @HostListener('focus')
  onHostFocus(): void {
    this.focused = true;
  }

  /**
   * Listen host `blur` event to trigger touched event.
   * And validate the value by its `type`.
   */
  @HostListener('blur')
  onHostBlur(): void {
    this.focused = false;
    this.markAsTouched();
    this._validateValue();
  }

  /**
   * Validate the value.
   */
  private _validateValue(): void {
    // Use `switch` statement since there can be more cases.
    switch (this.type) {
      case 'number': {
        // Reset the `value` to `'0'` when value is not a valid number.
        if (!ValidationUtil.isFloat(this.value)) {
          this.value = '0';
        }

        // Limit the number with `min` and `max` values.
        this.value = ParsingUtil.toLimitedNumber(ParsingUtil.toFloat(this.value), this.min, this.max).toString();

        // Apply validated value to `FormControl`.
        this.setValue(this.value);

        break;
      }

      default: {
        // Do nothing when `type` is not `'number'`.
        break;
      }
    }
  }
}
