/**
 * Option item for select or select-like.
 */
export class OptionItem<T> {
  /**
   * Label for option.
   */
  label: string;

  /**
   * Value for option.
   */
  value: T;

  constructor(label: string, value: T) {
    this.label = label;
    this.value = value;
  }
}
