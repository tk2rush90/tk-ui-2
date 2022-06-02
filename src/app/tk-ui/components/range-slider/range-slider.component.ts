import {Component, ElementRef, HostBinding, HostListener, Input, Optional, Self} from '@angular/core';
import {NgControl} from '@angular/forms';
import {AvailableKey, CommandKey, EventUtil} from '@tk-ui/utils/event.util';
import {EventListenerService} from '@tk-ui/services/common/event-listener.service';
import {CustomFormControl} from '@tk-ui/bases/custom-form-control/custom-form-control.directive';
import {ParsingUtil} from '@tk-ui/utils/parsing.util';

/**
 * The RangeSlider.
 * Only integer value is available.
 * If floating point value is needed, use multiplied value to integer and calculate after value changed.
 * For example, if range is between `1.0` to `4.5`, then use `10` to `45` instead.
 */
@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
  providers: [
    EventListenerService,
  ]
})
export class RangeSliderComponent extends CustomFormControl<number> {
  /**
   * Min value.
   */
  @Input() min = 0;

  /**
   * Max value.
   */
  @Input() max = 0;

  /**
   * Bind disabled class with `disabled` state.
   */
  @HostBinding('class.tk-disabled') disabled = false;

  /**
   * Current value.
   */
  private _value = 0;

  /**
   * Button's left position in percent.
   */
  private _percent = 0;

  constructor(
    @Self() @Optional() public override ngControl: NgControl,
    private elementRef: ElementRef<HTMLElement>,
    private eventListenerService: EventListenerService,
  ) {
    super(ngControl);
  }

  /**
   * Get `_percent` value for css style.
   */
  get percent(): string {
    return `${this._percent}%`;
  }

  /**
   * Return host element.
   */
  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  /**
   * Write value to component.
   * @param value - The value.
   */
  override writeValue(value: any) {
    this._value = value;
    this._calculatePositionByValue();
  }

  /**
   * Set disabled state.
   * @param isDisabled - Disabled state.
   */
  override setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Listen host `keydown` event to make user can change value with keyboards.
   * @param event - The `KeyboardEvent`.
   */
  @HostListener('keydown', ['$event'])
  onHostKeydown(event: KeyboardEvent): void {
    // Change the value with user's keyboard interaction.
    // If `ArrowRight` is down, increase the value.
    // If `ArrowLeft` is down, decrease the value.
    // When `Shift` key is pressed while pressing `ArrowRight` or `ArrowLeft`,
    // increase/decrease the value by `10`.
    if (EventUtil.isCommand(event, [CommandKey.shift], AvailableKey.ArrowRight)) {
      // Shift + ArrowRight.
      EventUtil.disable(event);
      this._increaseValue(10);

    } else if (EventUtil.isCommand(event, [CommandKey.shift], AvailableKey.ArrowLeft)) {
      // Shift + ArrowLeft.
      EventUtil.disable(event);
      this._decreaseValue(10);

    } else if (EventUtil.isKey(event, AvailableKey.ArrowRight)) {
      // ArrowRight.
      EventUtil.disable(event);
      this._increaseValue(1);

    } else if (EventUtil.isKey(event, AvailableKey.ArrowLeft)) {
      // ArrowLeft.
      EventUtil.disable(event);
      this._decreaseValue(1);
    }
  }

  /**
   * Listen `mousedown` event to start sliding.
   * @param event - The `MouseEvent`.
   */
  @HostListener('mousedown', ['$event'])
  onHostMousedown(event: MouseEvent): void {
    this._startSliding(event);
  }

  /**
   * Listen `touchstart` event to start sliding.
   * @param event - The `TouchEvent`.
   */
  @HostListener('touchstart', ['$event'])
  onHostTouchstart(event: TouchEvent): void {
    this._startSliding(event);
  }

  /**
   * Set initial state to start sliding.
   * @param event - Mouse event.
   */
  private _startSliding(event: MouseEvent | TouchEvent): void {
    if (!this.disabled) {
      this._calculateValueByPosition(event);
      this._addWindowEvents();
    }
  }

  /**
   * Increase the value by `by`.
   * The value will be limited between `min` and `max`.
   */
  private _increaseValue(by: number): void {
    if (!this.disabled) {
      this.setValue(ParsingUtil.toLimitedNumber(this._value + by, this.min, this.max));
    }
  }

  /**
   * Decrease the value by `by`.
   * The value will be limited between `min` and `max`.
   */
  private _decreaseValue(by: number): void {
    if (!this.disabled) {
      this.setValue(ParsingUtil.toLimitedNumber(this._value - by, this.min, this.max));
    }
  }

  /**
   * Add window events.
   */
  private _addWindowEvents(): void {
    this.eventListenerService.addEvent(window, 'mousemove', this._onWindowMouseMove);
    this.eventListenerService.addEvent(window, 'mouseup', this._onWindowMouseUp);
    this.eventListenerService.addEvent(window, 'touchmove', this._onWindowMouseMove);
    this.eventListenerService.addEvent(window, 'touchend', this._onWindowMouseUp);
  }

  /**
   * Handle window mousemove event.
   * @param event - Mouse event.
   */
  private _onWindowMouseMove = (event: MouseEvent | TouchEvent): void => {
    this._calculateValueByPosition(event);
  }

  /**
   * Handle window mouseup event.
   */
  private _onWindowMouseUp = (): void => {
    this.eventListenerService.removeEvent(window, 'mousemove', this._onWindowMouseMove);
    this.eventListenerService.removeEvent(window, 'mouseup', this._onWindowMouseUp);
    this.eventListenerService.removeEvent(window, 'touchmove', this._onWindowMouseMove);
    this.eventListenerService.removeEvent(window, 'touchend', this._onWindowMouseUp);
  }

  /**
   * Calculate button position by value.
   */
  private _calculatePositionByValue(): void {
    this._percent = (this._value - this.min) / (this.max - this.min) * 100;
  }

  /**
   * Calculate value by button position.
   * @param event - Mouse event.
   */
  private _calculateValueByPosition(event: MouseEvent | TouchEvent): void {
    const domRect = this.element.getBoundingClientRect();
    const {x} = EventUtil.getXY(event);
    let value = Math.round((x - domRect.x) / domRect.width * (this.max - this.min) + this.min);

    if (value < this.min) {
      value = this.min;
    }

    if (value > this.max) {
      value = this.max;
    }

    this.setValue(value);
  }
}
