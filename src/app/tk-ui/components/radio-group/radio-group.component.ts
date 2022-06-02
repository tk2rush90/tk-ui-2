import {AfterContentInit, Component, ContentChildren, HostListener, Optional, QueryList, Self} from '@angular/core';
import {RadioComponent} from '@tk-ui/components/radio-group/radio/radio.component';
import {CustomFormControl} from '@tk-ui/bases/custom-form-control/custom-form-control.directive';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {NgControl} from '@angular/forms';
import {AvailableKey, EventUtil} from '@tk-ui/utils/event.util';

@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class RadioGroupComponent<T> extends CustomFormControl<T> implements AfterContentInit {
  /**
   * Get the radio components from rendered contents.
   */
  @ContentChildren(RadioComponent) radioList!: QueryList<RadioComponent<T>>;

  /**
   * Radio selected cursor.
   */
  cursor = -1;

  /**
   * The selected radio value.
   */
  private _value!: T;

  private _disabled = false;

  private _focused = false;

  constructor(
    @Self() @Optional() public override ngControl: NgControl,
    private subscriptionService: SubscriptionService,
  ) {
    super(ngControl);
  }

  ngAfterContentInit(): void {
    this._subscribeRadioChanges();
    this._subscribeRadioListClick();
    this._setSelectedRadio();
  }

  /**
   * Write radio value.
   * @param value - The value.
   */
  override writeValue(value: T): void {
    this._value = value;
    this._setSelectedRadio();
  }

  /**
   * Set disabled state to component.
   * @param isDisabled - Disabled state.
   */
  override setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this._updateRadioDisabled();
  }

  /**
   * Listen `focus` event.
   */
  @HostListener('focus')
  onHostFocus(): void {
    this._focused = true;
    this._updateRadioFocused();
  }

  /**
   * Listen `blur` event.
   */
  @HostListener('blur')
  onHostBlur(): void {
    this._focused = false;
    this._updateRadioFocused();
  }

  /**
   * Listen keyboard event.
   * @param event - The `KeyboardEvent`.
   */
  @HostListener('keydown', ['$event'])
  onHostKeydown(event: KeyboardEvent): void {
    if (
      EventUtil.isKey(event, AvailableKey.ArrowRight)
      || EventUtil.isKey(event, AvailableKey.ArrowDown)
    ) {
      // Move cursor to next.
      EventUtil.disable(event);
      this._toNextCursor();
    } else if (
      EventUtil.isKey(event, AvailableKey.ArrowLeft)
      || EventUtil.isKey(event, AvailableKey.ArrowUp)
    ) {
      // Move cursor to previous.
      EventUtil.disable(event);
      this._toPreviousCursor();
    }
  }

  /**
   * Move to next cursor.
   */
  private _toNextCursor(): void {
    this.cursor = Math.min(this.cursor + 1, this.radioList.length - 1);
    this._updateValueWithCursor();
  }

  /**
   * Move to previous cursor.
   */
  private _toPreviousCursor(): void {
    this.cursor = Math.max(this.cursor - 1, 0);
    this._updateValueWithCursor();
  }

  /**
   * Update the radio selection with `_value`.
   * Update the `cursor` as well.
   */
  private _setSelectedRadio(): void {
    this.radioList.forEach(radio => radio.selected = radio.value === this._value);
    this._updateCursor();
  }

  /**
   * Update the `value` with `cursor`.
   */
  private _updateValueWithCursor(): void {
    const radio = this.radioList.get(this.cursor);

    if (radio) {
      this.setValue(radio.value);
    }
  }

  /**
   * Update the cursor with selected radio.
   */
  private _updateCursor(): void {
    this.radioList.forEach((radio, index) => {
      if (radio.selected) {
        this.cursor = index;
      }
    });
  }

  /**
   * Update `focused` state of each radio.
   */
  private _updateRadioFocused(): void {
    this.radioList.forEach(radio => radio.focused = this._focused);
  }

  /**
   * Update `disabled` state of each radio.
   */
  private _updateRadioDisabled(): void {
    this.radioList.forEach(radio => radio.disabled = this._disabled);
  }

  /**
   * Subscribe changes of radio list.
   */
  private _subscribeRadioChanges(): void {
    const sub = this.radioList
      .changes
      .subscribe(() => {
        // Re-subscribe click events from radio list.
        this._subscribeRadioListClick();
      });

    this.subscriptionService.store('_subscribeRadioChanges', sub);
  }

  /**
   * Subscribe click event from radio list to update value.
   */
  private _subscribeRadioListClick(): void {
    const subs = this.radioList.map(radio => {
      return radio.radioClick
        .subscribe(() => {
          this.setValue(radio.value);
        });
    });

    this.subscriptionService.store('_subscribeRadioListClick', subs);
  }
}
