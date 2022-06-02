import {DateLike} from '@tk-ui/others/types';

export class ValidationUtil {
  /**
   * Return true when the value is not null or undefined.
   * @param value - Value.
   */
  static isDefined(value: any): boolean {
    return value !== undefined && value !== null;
  }

  /**
   * Return true when the value is valid float format.
   * @param value - Value to check.
   */
  static isFloat(value: string | number): boolean {
    const floatReg = /^(([+-])?(0|([1-9][0-9]*))(\.[0-9]+)?)$/gm;

    return !!floatReg.exec(typeof value === 'string' ? value : value.toString());
  }

  /**
   * Return true when the value is valid integer format.
   * @param value - Value to check.
   */
  static isInteger(value: string | number): boolean {
    const integerReg = /^[+-]?[0-9]+$/gm;

    return !!integerReg.exec(typeof value === 'string' ? value : value.toString());
  }

  /**
   * Return true when the value is valid date value.
   * @param value - Value.
   */
  static isValidDate(value: DateLike): boolean {
    return !isNaN(new Date(value).getTime());
  }

  /**
   * Return true when the text is valid.
   * @param value - Value.
   */
  static isValidText(value: string): boolean {
    return this.isDefined(value) && !!value.trim();
  }
}
