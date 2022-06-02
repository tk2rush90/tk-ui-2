export class ArrayUtil {
  /**
   * Get summation of number array.
   * @param numbers - The array of numbers.
   */
  static sum(numbers: number[]): number {
    if (numbers.length > 0) {
      return numbers.reduce(((previousValue, currentValue) => {
        return (previousValue || 0) + currentValue;
      }));
    } else {
      return 0;
    }
  }

  /**
   * Get maximum number from number array.
   * @param numbers - The array of numbers.
   */
  static max(numbers: number[]): number {
    if (numbers.length > 0) {
      return Math.max(...numbers);
    } else {
      return 0;
    }
  }
}
