export class StringUtil {
  /**
   * Return state of whether `target` text contains `search` text.
   * @param target - Target text.
   * @param search - Search text.
   * @param ignoreCase - State of ignoring case.
   */
  static contains(target: string, search: string, ignoreCase = true): boolean {
    if (ignoreCase) {
      return target.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    } else {
      return target.indexOf(search) !== -1;
    }
  }
}
