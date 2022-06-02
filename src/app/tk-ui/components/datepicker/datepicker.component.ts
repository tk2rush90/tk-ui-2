import {Component, ElementRef, HostListener, Input, Optional, Self, ViewChild} from '@angular/core';
import {CustomFormControl} from '@tk-ui/bases/custom-form-control/custom-form-control.directive';
import {NgControl} from '@angular/forms';
import {OverlayContentsRef, OverlayService} from '@tk-ui/components/overlay/overlay.service';
import {
  DatepickerCalendarComponent,
  DatepickerCalendarData
} from '@tk-ui/components/datepicker/datepicker-calendar/datepicker-calendar.component';
import {OverlayOutletComponent} from '@tk-ui/components/overlay/overlay-outlet/overlay-outlet.component';
import {DatePipe} from '@angular/common';
import {AvailableKey, EventUtil} from '@tk-ui/utils/event.util';

/**
 * The Datepicker component.
 */
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    OverlayService,
  ],
})
export class DatepickerComponent extends CustomFormControl<Date | undefined> {
  /**
   * The placeholder for input.
   */
  @Input() placeholder = '';

  /**
   * The format to display selected date.
   * It must follow format of the `DatePipe` of Angular.
   */
  @Input() format = 'yyyy-MM-dd';

  /**
   * Refer to the overlay outlet.
   */
  @ViewChild(OverlayOutletComponent) overlayOutlet!: OverlayOutletComponent;

  /**
   * Refer to the calendar toggle button.
   */
  @ViewChild('button', {read: ElementRef}) buttonRef!: ElementRef<HTMLElement>;

  /**
   * Focused state.
   */
  focused = false;

  /**
   * Disabled state.
   */
  disabled = false;

  /**
   * The selected date.
   */
  private _date?: Date;

  /**
   * The `DatePipe` to format displaying date.
   */
  private _datePipe = new DatePipe('en-US');

  /**
   * The `OverlayContentsRef` for calendar.
   */
  private _calendarOverlayContentsRef?: OverlayContentsRef<DatepickerCalendarComponent, Date | undefined> | null = null;

  constructor(
    @Self() @Optional() public override ngControl: NgControl,
    private elementRef: ElementRef<HTMLElement>,
    private overlayService: OverlayService,
  ) {
    super(ngControl);
  }

  /**
   * Get date label.
   */
  get label(): string {
    return this._date ? this._datePipe.transform(this._date, this.format) || '' : '';
  }

  /**
   * Get host element.
   */
  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  /**
   * Get opened state.
   */
  get opened(): boolean {
    return !!this._calendarOverlayContentsRef;
  }

  /**
   * Write date value to component.
   * @param value - The value.
   */
  override writeValue(value: Date | undefined): void {
    this._date = value;
  }

  /**
   * Set disabled state.
   * @param isDisabled - The disabled state.
   */
  override setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Listen host `keydown` event.
   * @param event - The `KeyboardEvent`.
   */
  @HostListener('keydown', ['$event'])
  onHostKeydown(event: KeyboardEvent): void {
    if (
      !this.opened
      && (
        EventUtil.isKey(event, AvailableKey.Enter)
        || EventUtil.isKey(event, AvailableKey.Space)
      )
    ) {
      EventUtil.disable(event);

      this.openCalendar();
    }
  }

  /**
   * Set focus to host element.
   */
  @HostListener('focus')
  onHostFocus(): void {
    this.focused = true;
  }

  /**
   * Remove focus from host element.
   */
  @HostListener('blur')
  onHostBlur(): void {
    this.focused = false;
  }

  /**
   * Move focus to the host element.
   */
  moveFocusToHost(): void {
    this.element.focus();
  }

  /**
   * Open calendar.
   */
  openCalendar(): void {
    if (!this.opened) {
      this._calendarOverlayContentsRef = this.overlayService
        .drawComponent<DatepickerCalendarComponent, DatepickerCalendarData, Date | undefined>({
          id: this.overlayOutlet.id,
          component: DatepickerCalendarComponent,
          data: {
            value: this._date,
            button: this.buttonRef.nativeElement,
          },
          onClose: res => {
            if (res) {
              this.setValue(res);
            }

            this._calendarOverlayContentsRef = null;
          },
        });
    }
  }
}
