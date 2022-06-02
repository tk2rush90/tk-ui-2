import {DatePipe} from '@angular/common';
import {DateLike, NumberLike} from '@tk-ui/others/types';
import {ParsingUtil} from '@tk-ui/utils/parsing.util';

/**
 * Option to create calendar dates.
 */
export interface CalendarOptions {
  /**
   * Set the year to get calendar dates.
   * Default value is current year.
   */
  year?: NumberLike;

  /**
   * Set the month to get calendar dates.
   * Default value is current month.
   * Starts from `0`.
   */
  month?: NumberLike;

  /**
   * Set the starting day of week.
   * Default value is `0`.
   */
  startingDayOfWeek?: number;
}

/**
 * Calendar option with non-empty values.
 */
export interface CompletedCalendarOptions {
  year: number;
  month: number;
  startingDayOfWeek: number;
}

export class DateUtil {
  /**
   * Return `true` when `date1` is later than `date2`.
   * It isn't comparing time values.
   * @param date1 - Date 1.
   * @param date2 - Date 2.
   */
  static isLater(date1: Date, date2: Date): boolean {
    const _year1 = date1.getFullYear();
    const _month1 = date1.getMonth();
    const _date1 = date1.getDate();

    const _year2 = date2.getFullYear();
    const _month2 = date2.getMonth();
    const _date2 = date2.getDate();

    return (new Date(_year1, _month1, _date1)).valueOf() > (new Date(_year2, _month2, _date2)).valueOf();
  }

  /**
   * Return `true` when `date1` and `date2` are same.
   * It isn't comparing time values.
   * @param date1 - Date 1.
   * @param date2 - Date 2.
   */
  static isSame(date1: Date, date2?: Date): boolean {
    return (
      date1.getFullYear() === date2?.getFullYear()
      && date1.getMonth() === date2?.getMonth()
      && date1.getDate() === date2?.getDate()
    );
  }

  /**
   * Parse the mm/dd/yy string date to milliseconds.
   * @param date Date string formatted with mm/dd/yy.
   */
  static parse(date: string): Date | undefined {
    // Remove all slashes.
    date = date.replace(/\//g, '');

    const reg = /^\d{6}$/;

    if (reg.test(date)) {
      let m: NumberLike = date.substring(0, 2);
      let d: NumberLike = date.substring(2, 4);
      let y: NumberLike = date.substring(4, 6);

      m = ParsingUtil.toInteger(m);
      d = ParsingUtil.toInteger(d);
      y = ParsingUtil.toInteger(y);

      return new Date(2000 + y, m - 1, d);
    } else {
      return;
    }
  }

  /**
   * Return the formatted date by using Angular `DatePipe`.
   * @param date - Date to format.
   * @param format - Format string should follow Angular `DatePipe` format.
   * @param locale - Locale of formatted string.
   */
  static format(date: DateLike, format: string, locale = 'en-US'): string | null {
    const datePipe = new DatePipe(locale);

    return datePipe.transform(date, format);
  }

  /**
   * Return the date list for specific year and month.
   * @param options - Option to create calendar.
   */
  static calendar(options?: CalendarOptions): CalendarDate[] {
    // Today's date to set initial `year`, `month` of calendar options.
    const date = new Date();
    const {
      year = date.getFullYear(),
      month = date.getMonth(),
      startingDayOfWeek = 0
    } = (options || {}) as CompletedCalendarOptions;

    let calendarStartDate: Date;
    const monthStartDate = new Date(year, month, 1);
    const monthStartDayOfWeek = monthStartDate.getDay();

    // Calculate starting date of calendar.
    if (monthStartDayOfWeek > startingDayOfWeek) {
      calendarStartDate = new Date(year, month, 1 - (monthStartDayOfWeek - startingDayOfWeek));
    } else if (monthStartDayOfWeek < startingDayOfWeek) {
      // If `startingDayOfWeek` is `3` and `monthStartDayOfWeek` is `0`,
      // Then, we can imagine following figure of calendar:
      //
      // Wed Thu Fri Sat Sun Mon Tue
      // 27  28  29  30  1   2   3   : Dates
      // 3   4   5   6   0   1   2   : Day of Weeks
      //
      // In this case, to calculate the start date of calendar,
      //
      // Wed Thu Fri Sat Sun Mon Tue
      // 27  28  29  30  1   2   3   : Dates
      // 3   4   5   6   0   1   2   : Day of Weeks
      // └----------┘└┘
      //       a        b
      //
      // reduce (a + b) from the `monthStartDayOfWeek`.
      // So, the formula is (6 - `startingDayOfWeek` + `monthStartDayOfWeek` + 1);
      calendarStartDate = new Date(year, month, 1 - (6 - startingDayOfWeek + monthStartDayOfWeek + 1));
    } else {
      calendarStartDate = monthStartDate;
    }

    // Create calendar dates.
    const dates: CalendarDate[] = [];
    const calendarStartYear = calendarStartDate.getFullYear();
    const calendarStartMonth = calendarStartDate.getMonth();
    let calendarDate = calendarStartDate.getDate();

    // Create 42 dates.
    while (dates.length < 42) {
      const createdCalendarDate = new CalendarDate(calendarStartYear, calendarStartMonth, calendarDate);

      // Set `isExcluded` by comparing `year` and `month` parameters.
      // The `year` and `month` parameters are targeting displaying calendar month.
      // So, if `createdCalendarDate.year` or `createdCalendarDate.month` is not equal with `year` and `month`,
      // that's not included in the targeting month.
      createdCalendarDate.isExcluded = year !== createdCalendarDate.year || month !== createdCalendarDate.month;
      dates.push(createdCalendarDate);

      calendarDate++;
    }

    return dates;
  }
}

/**
 * The class to display date of calendar.
 */
export class CalendarDate {
  /**
   * Year of calendar date.
   */
  year: number;

  /**
   * Month of calendar date.
   */
  month: number;

  /**
   * Date of calendar date.
   */
  date: number;

  /**
   * Day of week of calendar date.
   */
  dayOfWeek: number;

  /**
   * The date object.
   */
  dateObject: Date;

  /**
   * Set `true` when date is excluded from the displaying year and month.
   */
  isExcluded = false;

  /**
   * create calendar date model
   * @param year - The year of calendar date.
   * @param month - The month of calendar date. Starts from `0`.
   * @param date - The date of calendar date.
   */
  constructor(year: number, month: number, date: number) {
    this.dateObject = new Date(year, month, date);
    this.year = this.dateObject.getFullYear();
    this.month = this.dateObject.getMonth();
    this.date = this.dateObject.getDate();
    this.dayOfWeek = this.dateObject.getDay();
  }
}
