/**
 * date like types
 */
export type DateLike = Date | number | string;

/**
 * number like types
 */
export type NumberLike = string | number;

/**
 * Define simple key/value map.
 */
export interface ObjectMap<V> {
  [k: string | number]: V;
}

/**
 * Define simple rect interface.
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
