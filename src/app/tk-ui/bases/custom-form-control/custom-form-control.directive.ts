import {Directive, HostBinding, Input, Optional, Self} from '@angular/core';
import {ControlValueAccessor, NgControl} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {Logger, LoggerUtil} from '@tk-ui/utils/logger.util';

const {
  production,
} = environment;

/**
 * The base class to create customized `FormControl`.
 */
@Directive({
  selector: '[appCustomFormControl]'
})
export class CustomFormControl<T> implements ControlValueAccessor {
  /**
   * Set component tabindex.
   */
  @Input() @HostBinding('attr.tabindex') tabindex = 0;

  /**
   * `OnChange` callback function.
   */
  protected _onChange: any;

  /**
   * `OnTouched` callback function.
   */
  protected _onTouched: any;

  /**
   * Logger.
   */
  protected _logger: Logger;

  constructor(
    @Self() @Optional() public ngControl: NgControl,
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }

    this._logger = LoggerUtil.createLogger(this);
  }

  /**
   * Get control touched state.
   */
  get touched(): boolean {
    return !!this.ngControl?.touched;
  }

  /**
   * Get control dirty state.
   */
  get dirty(): boolean {
    return !!this.ngControl?.dirty;
  }

  /**
   * Get control invalid state.
   */
  get invalid(): boolean {
    return !!this.ngControl?.invalid;
  }

  /**
   * Should be implemented by extended class.
   * @param value - The value.
   */
  writeValue(value: T): void {
    if (!production) {
      this._logger.warn(`'writeValue()' method is not implemented.`);
    }
  }

  /**
   * Set value to `NgControl`.
   * @param value - The value.
   */
  setValue(value: T): void {
    // When setting value to `NgControl`,
    // write changed value to the Component/Directive by calling `writeValue()` method as well.
    this.writeValue(value);
    this.markAsDirty(value);
  }

  /**
   * Should be implemented by extended class.
   * @param isDisabled - The disabled state.
   */
  setDisabledState(isDisabled: boolean): void {
    if (!production) {
      this._logger.warn(`'setDisabledState()' method is not implemented.`);
    }
  }

  /**
   * Call `OnChange` callback function.
   * @param value - The value.
   */
  markAsDirty(value: T): void {
    if (this._onChange) {
      this._onChange(value);
    }
  }

  /**
   * Call `OnTouched` callback function.
   */
  markAsTouched(): void {
    if (this._onTouched) {
      this._onTouched();
    }
  }

  /**
   * Register `OnChange` callback function to class.
   * @param fn - The function of `OnChange`.
   */
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  /**
   * Register `OnTouched` callback function to class.
   * @param fn - The function of `OnTouched`.
   */
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
}
