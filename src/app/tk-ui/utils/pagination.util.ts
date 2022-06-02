export class PaginationUtil {
  /**
   * Get default pagination.
   * @param total - Total pages.
   * @param page - Current page (starts from `1`).
   * @param display - Display count of pages at once.
   */
  static getDefaultPagination(total: number, page: number, display: number): number[] {
    this._checkPageValidation(total, page);

    const half = Math.floor(display / 2);
    const even = display % 2 === 0;
    const previous = even ? half - 1 : half;

    let start: number
    let length: number;
    const pages = [];

    if (total < display) {
      start = 1;
      length = total;
    } else {
      start = Math.max(1, page - previous);
      length = Math.min(display, total - start + 1);

      if (length < display) {
        start = start + length - display;
        length = display;
      }
    }

    while (pages.length < length) {
      pages.push(start);

      start++;
    }

    return pages;
  }

  /**
   * Get row number pagination.
   * @param total - Total row length.
   * @param size - Page size.
   * @param page - Current page (starts from `1`).
   */
  static getRowNumberPagination(total: number, size: number, page: number): RowNumberPagination {
    const totalPage = Math.ceil(total / size);

    this._checkPageValidation(totalPage, page);

    return {
      start: (page - 1) * size + 1,
      end: Math.min(page * size, total),
    };
  }

  /**
   * Get ellipsis pagination.
   * @param total - Total pages.
   * @param page - Current page (starts from `1`).
   * @param startDisplay - The display count for starting pages.
   * @param middleDisplay - The display count for middle pages.
   * @param endDisplay - The display count for ending pages.
   * @example
   * PaginationUtil.getEllipsisPagination(30, 1, 2, 5, 2); // {start: [1, 2, 3, 4, 5, 6, 7, 8], middle: [], end: [29, 30]}
   * PaginationUtil.getEllipsisPagination(30, 2, 2, 5, 2); // {start: [1, 2, 3, 4, 5, 6, 7, 8], middle: [], end: [29, 30]}
   * PaginationUtil.getEllipsisPagination(30, 3, 2, 5, 2); // {start: [1, 2, 3, 4, 5, 6, 7, 8], middle: [], end: [29, 30]}
   * PaginationUtil.getEllipsisPagination(30, 4, 2, 5, 2); // {start: [1, 2, 3, 4, 5, 6, 7, 8], middle: [], end: [29, 30]}
   * PaginationUtil.getEllipsisPagination(30, 5, 2, 5, 2); // {start: [1, 2, 3, 4, 5, 6, 7, 8], middle: [], end: [29, 30]}
   * PaginationUtil.getEllipsisPagination(30, 6, 2, 5, 2); // {start: [1, 2], middle: [4, 5, 6, 7, 8], end: [29, 30]}
   * PaginationUtil.getEllipsisPagination(11, 5, 2, 5, 2); // {start: [1, 2, 3, 4, 5, 6, 7, 8], middle: [], end: [10, 11]}
   * PaginationUtil.getEllipsisPagination(11, 6, 2, 5, 2); // {start: [1, 2], middle: [4, 5, 6, 7, 8], end: [10, 11]}
   * PaginationUtil.getEllipsisPagination(11, 7, 2, 5, 2); // {start: [1, 2], middle: [], end: [4, 5, 6, 7, 8, 9, 10, 11]}
   * PaginationUtil.getEllipsisPagination(10, 1, 2, 5, 2); // {start: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], middle: [], end: []}
   * PaginationUtil.getEllipsisPagination(30, 1, 3, 5, 3); // {start: [1, 2, 3, 4, 5, 6, 7, 8, 9], middle: [], end: [28, 29, 30]}
   * PaginationUtil.getEllipsisPagination(30, 7, 3, 5, 3); // {start: [1, 2, 3], middle: [5, 6, 7, 8, 9], end: [28, 29, 30]}
   */
  static getEllipsisPagination(total: number, page: number, startDisplay: number, middleDisplay: number, endDisplay: number): EllipsisPagination {
    this._checkPageValidation(total, page);

    const startEdgeDisplay = startDisplay + middleDisplay + 1;
    const endEdgeDisplay = endDisplay + middleDisplay + 1;
    const pagination: EllipsisPagination = new EllipsisPagination();

    if (total <= startDisplay + middleDisplay + endDisplay + 1) {
      // Render only starts.
      pagination.renderStartPages(total);
    } else {
      const middleHalf = Math.floor(middleDisplay / 2);
      const middleEven = middleDisplay % 2 === 0;
      const middlePrevious = middleEven ? middleHalf - 1 : middleHalf;

      const middleStart = Math.max(1, page - middlePrevious);
      const middleEnd = Math.min(total, page + middleHalf);

      if (1 + startDisplay >= middleStart) {
        // Do not render middle.
        pagination.renderStartPages(startEdgeDisplay);
        pagination.renderEndPages(total, endDisplay);
      } else if (total - endDisplay <= middleEnd) {
        // Do not render middle.
        pagination.renderStartPages(startDisplay);
        pagination.renderEndPages(total, endEdgeDisplay);
      } else {
        // Render middle.
        pagination.renderStartPages(startDisplay);
        pagination.renderMiddlePages(middleStart, middleDisplay);
        pagination.renderEndPages(total, endDisplay);
      }
    }

    return pagination;
  }

  /**
   * Check page validation.
   * @param total - Total page.
   * @param page - Current page.
   */
  private static _checkPageValidation(total: number, page: number): void {
    if (page > total || page < 1) {
      throw new Error('Invalid page number');
    }
  }
}

/**
 * Row number pagination.
 */
export interface RowNumberPagination {
  /**
   * Start row number.
   */
  start: number;

  /**
   * End row number.
   */
  end: number;
}

/**
 * Ellipsis pagination.
 * Each page is distinguished by ellipsis.
 */
export class EllipsisPagination {
  /**
   * Starting pages.
   */
  start: number[] = [];

  /**
   * Middle pages.
   */
  middle: number[] = [];

  /**
   * End pages.
   */
  end: number[] = [];

  /**
   * Render start pages.
   * @param display - The display count of start.
   */
  renderStartPages(display: number): void {
    let page = 1;

    while (this.start.length < display) {
      this.start.push(page);
      page++;
    }
  }

  /**
   * Render middle pages.
   * @param start - The start page of middle.
   * @param display - The display count of middle.
   */
  renderMiddlePages(start: number, display: number): void {
    while (this.middle.length < display) {
      this.middle.push(start);
      start++;
    }
  }

  /**
   * Render end pages.
   * @param total - The total pages.
   * @param display - The display count of end.
   */
  renderEndPages(total: number, display: number): void {
    while (this.end.length < display) {
      this.end.unshift(total);
      total--;
    }
  }
}
