export class RandomUtil {
  /**
   * Create random key.
   */
  static key(): string {
    return Math.random().toString(32).split('.')[1];
  }

  /**
   * Create random date.
   * @param start - Start date.
   * @param end - End date.
   */
  static date(start?: Date, end?: Date): Date {
    start = start || new Date(1990, 1, 1);
    end = end || new Date();

    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  /**
   * Pick random item from items array.
   * @param items - Items array.
   */
  static pick<T>(items: T[]): T {
    return items[this.number(0, items.length)];
  }

  /**
   * Pick random number between min and max.
   * Maximum number will not be chosen.
   * @param min - Min number.
   * @param max - Max number.
   */
  static number(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Create random color.
   */
  static color(): string {
    const r = Math.round(this.number(0, 255)).toString(16).padStart(2, '0');
    const g = Math.round(this.number(0, 255)).toString(16).padStart(2, '0');
    const b = Math.round(this.number(0, 255)).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
  }
}
