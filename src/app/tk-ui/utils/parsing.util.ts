import {NumberLike} from '@tk-ui/others/types';

export class ParsingUtil {
  /**
   * Parse non integer to integer.
   * @param value - - Value to parse.
   * @example
   * ParsingUtil.toInteger('3'); // 3
   * ParsingUtil.toInteger('3,000'); // 3000
   */
  static toInteger(value?: NumberLike): number {
    let int: number | undefined;

    if (typeof value === 'string') {
      int = parseInt(value.replace(/,/g, ''), undefined);
    } else if (typeof value === 'number') {
      int = Math.round(value);
    }

    // To prevent `NaN` or `undefined`.
    if (!int) {
      int = 0;
    }

    return int;
  }

  /**
   * Parse non float to float.
   * @param value - Value to parse.
   * @example
   * ParsingUtil.toFloat('0.34'); // 0.34
   * ParsingUtil.toFloat('1,000.50'); // 1000.50
   */
  static toFloat(value?: NumberLike): number {
    let float: number | undefined;

    if (typeof value === 'string') {
      float = parseFloat(value.replace(/,/g, ''));
    } else if (typeof value === 'number') {
      float = value;
    }

    // To prevent `NaN` or `undefined`.
    if (!float) {
      float = 0;
    }

    return float;
  }

  /**
   * To limited number with minimum and maximum values.
   * @param value - Value to limit.
   * @param min - Minimum value.
   * @param max - Maximum value.
   */
  static toLimitedNumber(value: number, min: number | undefined, max: number | undefined): number {
    if (min !== undefined) {
      value = Math.max(min, value);
    }

    if (max !== undefined) {
      value = Math.min(max, value);
    }

    return value;
  }

  /**
   * Array buffer to base64 url.
   * @param arrayBuffer - Array buffer to parse.
   */
  static arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);

    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }

  /**
   * Parse hex string to hsl numbers.
   * @param hex - Hex.
   */
  static hexToHsl(hex: string): number[] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const hsl = [];

    if (result) {
      const r = parseInt(result[1], 16) / 255;
      const g = parseInt(result[2], 16) / 255;
      const b = parseInt(result[3], 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);

      let h = 0;
      let s = 0;
      let l = (max + min) / 2;

      if (max !== min) {
        const distance = max - min;

        s = l > 0.5 ? distance / (2 - max - min) : distance / (max + min);
        switch (max) {
          case r: {
            h = (g - b) / distance + (g < b ? 6 : 0);
            break;
          }

          case g: {
            h = (b - r) / distance + 2;
            break;
          }

          case b: {
            h = (r - g) / distance + 4;
            break;
          }
        }

        h /= 6;
      }

      s = Math.round(s * 100);
      l = Math.round(l * 100);
      h = Math.round(360 * h);

      hsl.push(h, s, l);
    }

    return hsl;
  }

  /**
   * Parse hsl number array to hex.
   * @param hsl - Hsl.
   */
  static hslToHex(hsl: number[]): string {
    let [h, s, l] = hsl;

    l /= 100;

    const a = s * Math.min(l, 1 - l) / 100;

    // Converter function.
    const converter = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };

    return `#${converter(0)}${converter(8)}${converter(4)}`;
  }

  /**
   * Hex to rgb array.
   * @param hex - Hex.
   */
  static hexToRgb(hex: string): number[] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const rgb = [];

    if (result) {
      const r = Math.round(parseInt(result[1], 16));
      const g = Math.round(parseInt(result[2], 16));
      const b = Math.round(parseInt(result[3], 16));

      rgb.push(r, g, b);
    }

    return rgb;
  }

  /**
   * Rgb to hex string.
   * @param rgb - Rgb.
   */
  static rgbToHex(rgb: number[]): string {
    const [r, g, b] = rgb;

    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  }
}
