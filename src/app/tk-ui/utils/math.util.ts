import {Rect} from '@tk-ui/others/types';

export class MathUtil {
  /**
   * Degree to radian.
   * @param deg - Degree value.
   */
  static degreeToRadian(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Radian to degree.
   * @param rad - Radian value.
   */
  static radianToDegree(rad: number): number {
    return rad * (180 / Math.PI);
  }

  /**
   * Return percent as radian.
   * @param percent - The percent value from `0` to `100`.
   */
  static percentToRadian(percent: number): number {
    return this.degreeToRadian(this.percentToDegree(percent));
  }

  /**
   * Return percent as degree.
   * @param percent - The percent value from `0` to `100`.
   */
  static percentToDegree(percent: number): number {
    return 360 * (percent / 100);
  }

  /**
   * Get coordinates for point on arc.
   * @param cx - The arc center x.
   * @param cy - The arc center y.
   * @param r - The radius or arc.
   * @param angle - The angle in degree.
   */
  static getArcPointCoordinates(cx: number, cy: number, r: number, angle: number): [number, number] {
    const rad = this.degreeToRadian(angle);

    return [cx + Math.cos(rad) * r, cy + Math.sin(rad) * r];
  }

  /**
   * Return circle round length.
   * @param radius - Radius value.
   */
  static getCircleRoundLength(radius: number): number {
    return radius * 2 * Math.PI;
  }

  /**
   * Return arc length by start angle to end angle.
   * @param radius - Radius value.
   * @param start - The start angle in degree.
   * @param end - The end angle in degree.
   */
  static getArcLength(radius: number, start: number, end: number): number {
    return this.getCircleRoundLength(radius) * (Math.abs(end - start) / 360);
  }

  /**
   * Get state of whether `rect1` contains `rect2` horizontally or not.
   * @param rect1 - The container rect.
   * @param rect2 - The rect to be contained.
   * @param allowCovered - The flag to allow just covered state instead of containing the `rect2` *inside* to the `rect1`.
   */
  static horizontallyContains(rect1: Rect, rect2: Rect, allowCovered = false): boolean {
    const rect1Top = rect1.y;
    const rect1Bottom = rect1.y + rect1.height;

    const rect2Top = rect2.y;
    const rect2Bottom = rect2.y + rect2.height;

    if (allowCovered) {
      return (rect1Top <= rect2Top && rect1Bottom >= rect2Top) || (rect1Bottom <= rect2Bottom && rect1Bottom >= rect2Top);
    } else {
      return rect1Top <= rect2Top && rect1Bottom >= rect2Bottom;
    }
  }

  /**
   * Get state of whether `rect1` contains `rect2` vertically or not.
   * @param rect1 - The container rect.
   * @param rect2 - The rect to be contained.
   * @param allowCovered - The flag to allow just covered state instead of containing the `rect2` *inside* to the `rect1`.
   */
  static verticallyContains(rect1: Rect, rect2: Rect, allowCovered = false): boolean {
    const rect1Left = rect1.x;
    const rect1Right = rect1.x + rect1.width;

    const rect2Left = rect2.x;
    const rect2Right = rect2.x + rect2.width;

    if (allowCovered) {
      return (rect1Left <= rect2Left && rect1Right >= rect2Left) || (rect1Right <= rect2Right && rect1Right >= rect2Left);
    } else {
      return rect1Left <= rect2Left && rect1Right >= rect2Right;
    }
  }
}
