import {Component, ElementRef, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {EventListenerService} from '@tk-ui/services/common/event-listener.service';
import {OverlayProviders, OverlayService} from '@tk-ui/components/overlay/overlay.service';
import {CalendarDate, DateUtil} from '@tk-ui/utils/date.util';
import {InputOverlay, InputOverlayData} from '@tk-ui/bases/input-overlay/input-overlay.component';
import {AvailableKey, CommandKey, EventUtil} from '@tk-ui/utils/event.util';

/**
 * The data for `DatepickerCalendarComponent`.
 */
export interface DatepickerCalendarData extends InputOverlayData {
  /**
   * Current selected date value.
   */
  value?: Date;
}

/**
 * The calendar for datepicker.
 */
@Component({
  selector: 'app-datepicker-calendar',
  templateUrl: './datepicker-calendar.component.html',
  styleUrls: ['./datepicker-calendar.component.scss'],
  providers: [
    EventListenerService,
  ],
})
export class DatepickerCalendarComponent extends InputOverlay implements OnInit, OnDestroy {
  /**
   * `CalendarDate`s to display in the view.
   */
  dates: CalendarDate[] = [];

  /**
   * Selected date.
   */
  selectedDate?: Date;

  /**
   * Today data.
   */
  today = new Date();

  /**
   * The initial of each day of week.
   */
  dayOfWeeks = [
    'S',
    'M',
    'W',
    'T',
    'T',
    'F',
    'S',
  ];

  /**
   * The cursor of date.
   */
  private _cursor = -1;

  /**
   * The target date to display calendar for specific year and month.
   */
  private _targetDate!: Date;

  /**
   * The Timeout timer to position the calendar.
   */
  private _positioningTimer: any;

  constructor(
    @Inject(OverlayProviders.id) protected override id: string,
    @Inject(OverlayProviders.data) protected override data: DatepickerCalendarData,
    protected override elementRef: ElementRef<HTMLElement>,
    protected override overlayService: OverlayService,
    protected override eventListenerService: EventListenerService,
  ) {
    super(id, data, elementRef, overlayService, eventListenerService);
  }

  ngOnInit(): void {
    this.selectedDate = this.data.value;
    this._onSelectedDateChange();
    this._setInitialCursorPosition();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    this._positioningTimer = setTimeout(() => {
      this._setPositioningStyles();
      this._startAnimation();
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this._positioningTimer);
  }

  /**
   * Set cursor.
   * It also updates the `selectedDate` with cursor.
   * @param cursor - THe cursor.
   */
  set cursor(cursor: number) {
    this._cursor = cursor;
    this.selectedDate = this.dates[this._cursor]?.dateObject;
  }

  /**
   * Get cursor.
   */
  get cursor(): number {
    return this._cursor;
  }

  /**
   * Get current target date.
   */
  get targetDate(): Date {
    return this._targetDate;
  }

  /**
   * Get year to display dates.
   */
  get targetYear(): number {
    return this._targetDate.getFullYear();
  }

  /**
   * Get month to display dates.
   */
  get targetMonth(): number {
    return this._targetDate.getMonth();
  }

  /**
   * Get the first index of included dates.
   */
  get firstIndexOfIncludedDates(): number {
    return this.dates.findIndex(date => !date.isExcluded);
  }

  /**
   * Get the last index of included dates.
   */
  get lastIndexOfIncludedDates(): number {
    let index = -1;

    // Loop the `dates` and update the `index` when the `date` is not excluded from year and month.
    // It will find last index of included date.
    this.dates.forEach((date, _index) => {
      if (!date.isExcluded) {
        index = _index;
      }
    });

    return index;
  }

  /**
   * Listen `keydown` event of window to detect user keyboard input.
   * @param event - The `KeyboardEvent`.
   */
  @HostListener('window:keydown', ['$event'])
  onWindowKeydown(event: KeyboardEvent): void {
    if (
      EventUtil.isKey(event, AvailableKey.Escape)
      || EventUtil.isKey(event, AvailableKey.Tab)
    ) {
      // Close the overlay when `Escape` or `Tab` is downed.
      EventUtil.disable(event);
      this.closeOverlay();

    } else if (
      EventUtil.isKey(event, AvailableKey.Enter)
      || EventUtil.isKey(event, AvailableKey.Space)
    ) {
      // Confirm the selection when `Enter` of `Space` is downed.
      this.closeOverlay(this.selectedDate);

    } else if (EventUtil.isCommand(event, [CommandKey.shift], AvailableKey.ArrowRight)) {
      // Move to next month on Shift + ArrowRight.
      EventUtil.disable(event);
      this.toNextMonth();
      this.cursor = this.firstIndexOfIncludedDates;

    } else if (EventUtil.isCommand(event, [CommandKey.shift], AvailableKey.ArrowLeft)) {
      // Move to previous month on Shift + ArrowRight.
      EventUtil.disable(event);
      this.toPreviousMonth();
      this.cursor = this.lastIndexOfIncludedDates;

    } else if (EventUtil.isKey(event, AvailableKey.ArrowRight)) {
      // Increase the cursor by `1`.
      EventUtil.disable(event);
      this._increaseCursor(1);

    } else if (EventUtil.isKey(event, AvailableKey.ArrowLeft)) {
      // Decrease the cursor by `-1`.
      EventUtil.disable(event);
      this._decreaseCursor(-1);

    } else if (EventUtil.isKey(event, AvailableKey.ArrowDown)) {
      // Increase the cursor by `7`.
      EventUtil.disable(event);
      this._increaseCursor(7);

    } else if (EventUtil.isKey(event, AvailableKey.ArrowUp)) {
      // Decrease the cursor by `-7`.
      EventUtil.disable(event);
      this._decreaseCursor(-7);

    }
  }

  /**
   * Update the `selectedDate` and re-generate calendar dates.
   * @param calendarDate - Selected `CalendarDate`.
   */
  onDateClick(calendarDate: CalendarDate): void {
    this.selectedDate = calendarDate.dateObject;
    this._onSelectedDateChange();
    this._setInitialCursorPosition();
  }

  /**
   * TrackBy function to keep date position on click.
   * @param index - The index of date.
   * @param date - The `CalendarDate`.
   */
  dateTrackBy(index: number, date: CalendarDate): string {
    return date.dateObject.toDateString();
  }

  /**
   * Move to previous month.
   */
  toPreviousMonth(): void {
    this._targetDate = new Date(this.targetDate.getFullYear(), this.targetDate.getMonth() - 1);
    this._createCalendar();
  }

  /**
   * Move to next month.
   */
  toNextMonth(): void {
    this._targetDate = new Date(this.targetDate.getFullYear(), this.targetDate.getMonth() + 1);
    this._createCalendar();
  }

  /**
   * Close the overlay.
   * @param result - The result to pass.
   */
  closeOverlay(result?: Date): void {
    this.overlayService.clearOverlay(this.id, result);
  }

  /**
   * Increase the cursor by `by`.
   * @param by - The value to increase.
   */
  private _increaseCursor(by: number): void {
    let nextCursor = this.cursor + by;
    const previousLastIndexOfIncludedDates = this.lastIndexOfIncludedDates;

    // When cursor is bigger than last index of previous included dates,
    // move to next month and update the `nextCursor`.
    if (nextCursor > previousLastIndexOfIncludedDates) {
      this.toNextMonth();
      // Update the `nextCursor` to first index of included dates.
      nextCursor = this.firstIndexOfIncludedDates + (nextCursor - previousLastIndexOfIncludedDates - 1);
    }

    this.cursor = nextCursor;
  }

  /**
   * Decrease the cursor by `by`.
   * @param by - The value to decrease.
   */
  private _decreaseCursor(by: number): void {
    let nextCursor = this.cursor + by;
    const previousFirstIndexOfIncludedDates = this.firstIndexOfIncludedDates;

    // When cursor is smaller than first index of previous included dates,
    // move to previous month and update the `nextCursor`.
    if (nextCursor < previousFirstIndexOfIncludedDates) {
      this.toPreviousMonth();
      // Update the `nextCursor` to last index of included dates.
      nextCursor = this.lastIndexOfIncludedDates - (previousFirstIndexOfIncludedDates - nextCursor - 1);
    }

    this.cursor = nextCursor;
  }

  /**
   * Update the `_targetDate` and re-generate calendar dates.
   */
  private _onSelectedDateChange(): void {
    const newTargetDate = this.selectedDate || new Date();

    // Re-generate calendar dates only when target date has changed.
    if (!this.targetDate || !DateUtil.isSame(this._targetDate, newTargetDate)) {
      this._targetDate = newTargetDate;
      this._createCalendar();
    }
  }

  /**
   * Create calendar with `_targetDate`.
   */
  private _createCalendar(): void {
    this.dates = DateUtil.calendar({
      year: this.targetYear,
      month: this.targetMonth,
    });
  }

  /**
   * Set initial cursor position.
   */
  private _setInitialCursorPosition(): void {
    this._cursor = this.dates.findIndex(date => DateUtil.isSame(date.dateObject, this.selectedDate));
  }

  /**
   * Set positioning styles of calendar.
   */
  private _setPositioningStyles(): void {
    const buttonRect = this.data.button.getBoundingClientRect();
    const elementRect = this.element.getBoundingClientRect();

    // Put calendar to the right end of the button.
    this._x = buttonRect.right - elementRect.width;
    this._calculateYPosition(buttonRect, elementRect);
  }
}
