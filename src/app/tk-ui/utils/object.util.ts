import {ObjectMap} from '@tk-ui/others/types';

export class ObjectUtil {
  /**
   * Set object value with property string.
   * @param obj - The object to set value.
   * @param property - The property string. Can be separated with `.` word like: `prop1.prop2`.
   * @param value - The value to set.
   */
  static setObjectValue(obj: any, property: string, value: any): void {
    let target: any = obj;
    const properties = property.split('.');

    properties.forEach((p, i) => {
      if (i !== properties.length - 1) {
        if (!target[p]) {
          target[p] = {};
        }

        target = target[p];
      } else {
        target[p] = value;
      }
    });
  }

  /**
   * Get object value with property string.
   * @param data - The object to get value.
   * @param property  - The property string. Can be separated with `.` word like: `prop1.prop2`.
   */
  static getObjectValue<T>(data: any, property: string): T {
    const keys = property.split('.');
    const lastIndex = keys.length - 1;
    let target = data;

    keys.forEach((key, index) => {
      target = target[key];

      if (index !== lastIndex && !target) {
        target = {} as any;
      }
    });

    return target;
  }

  /**
   * Transform an array to map which is consist of unique keys of array.
   * @param items - The items to get unique keys.
   * @param property -
   * The property to check from each item.
   * If it is not specified, just create map with `item` in array.
   */
  static getUniqueKeys<T>(items: T[], property?: keyof T): ObjectMap<boolean> {
    const map: ObjectMap<boolean> = {};

    items.forEach(item => {
      const value: string | number = property ? item[property] as any : item;

      if (value) {
        map[value] = true;
      }
    });

    return map;
  }

  /**
   * Group an array by its key.
   * @param items - The items to group by key.
   * @param property - The property of key to group.
   */
  static groupArrayByKey<T>(items: T[], property: keyof T): ObjectMap<T[]> {
    const map: ObjectMap<T[]> = {};

    items.forEach(item => {
      const value: string | number = item[property] as any;

      if (value) {
        if (!map[value]) {
          map[value] = [];
        }

        map[value].push(item);
      }
    });

    return map;
  }
}
