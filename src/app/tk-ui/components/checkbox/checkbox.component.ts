import {Component, HostBinding, HostListener, Optional, Self} from '@angular/core';
import {CustomFormControl} from '@tk-ui/bases/custom-form-control/custom-form-control.directive';
import {NgControl} from '@angular/forms';
import {AvailableKey, EventUtil} from '@tk-ui/utils/event.util';

/**
 * Checkbox control alternates to `<input type="checkbox"/>`.
 */
@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent extends CustomFormControl<boolean> {
  /**
   * Disabled state.
   */
  @HostBinding('class.tk-disabled') disabled = false;

  /**
   * Checked state.
   */
  checked = false;

  constructor(
    @Self() @Optional() public override ngControl: NgControl,
  ) {
    super(ngControl);
  }

  /**
   * Write checked state.
   * @param value - The value.
   */
  override writeValue(value: boolean): void {
    this.checked = value;
  }

  /**
   * Set checkbox disabled.
   * @param isDisabled - Disabled state.
   */
  override setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Listen host `click` event to toggle checked state.
   */
  @HostListener('click')
  onHostClick(): void {
    this.setValue(!this.checked);
  }

  /**
   * Listen host `blur` event to mark as touched.
   */
  @HostListener('blur')
  onHostBlur(): void {
    this.markAsTouched();
  }

  /**
   * Listen host `keydown` event to make user can toggle checked state by keyboard.
   * @param event - The `KeyboardEvent`.
   */
  @HostListener('keydown', ['$event'])
  onHostKeydown(event: KeyboardEvent): void {
    // Allow `Enter` and `Space` key.
    if (
      EventUtil.isKey(event, AvailableKey.Enter)
      || EventUtil.isKey(event, AvailableKey.Space)
    ) {
      this.setValue(!this.checked);
    }
  }
}
