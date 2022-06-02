import {ObjectUtil} from '@tk-ui/utils/object.util';

/**
 * The order direction.
 */
export type OrderDirection = 'asc' | 'desc';

/**
 * The value type to order.
 */
export type OrderType = 'string' | 'date' | 'number';

/**
 * Sort column info.
 */
export interface SortColumn<T> {
  /**
   * The property name to sort.
   */
  property: keyof T;

  /**
   * The order direction.
   */
  direction: OrderDirection;

  /**
   * The value type to order.
   */
  type: OrderType;
}

export class SortUtil {
  /**
   * Sort data as ascending.
   * @param a - Data 1.
   * @param b - Data 2.
   */
  static sortMethodAsc<T>(a: T, b: T): number {
    return a === b ? 0 : a > b ? 1 : -1;
  }

  /**
   * Get sort method when sorting data with just order.
   * @param order - Sort order.
   */
  static sortMethodWithOrder<T>(order: 'asc' | 'desc'): any {
    if (order === undefined || order === 'asc') {
      return this.sortMethodAsc;
    } else {
      return (a: T, b: T) => {
        return -this.sortMethodAsc(a, b);
      };
    }
  }

  /**
   * Get sort method when sorting data with a single column.
   * @param property - Property string.
   * @param order - Sort order.
   * @param type - Value type.
   */
  static sortMethodWithOrderByColumn<T>({property, direction, type = 'string'}: SortColumn<T>): any {
    const sortMethod = this.sortMethodWithOrder(direction);

    return (a: T, b: T) => {
      let v1: any = ObjectUtil.getObjectValue<T>(a, property as any);
      let v2: any = ObjectUtil.getObjectValue<T>(b, property as any);

      switch (type) {
        case 'string': {
          v1 = v1 || '';
          v2 = v2 || '';

          return sortMethod(v1, v2);
        }

        case 'number': {
          v1 = parseFloat(v1 as string);
          v2 = parseFloat(v2 as string);

          return sortMethod(v1, v2);
        }

        case 'date': {
          v1 = new Date(v1).getTime();
          v2 = new Date(v2).getTime();

          return sortMethod(v1, v2);
        }

        default: {
          throw new Error(`Invalid value type: '${type}'`);
        }
      }
    };
  }

  /**
   * Get sort method when sorting data with multiple columns.
   * @param sortedColumns - Sorted column list.
   */
  static sortMethodWithOrderMultiColumn<T>(sortedColumns: SortColumn<T>[]): any {
    const sortMethodsForColumn = (sortedColumns || []).map((item) =>
      this.sortMethodWithOrderByColumn(item),
    );

    return (a: T, b: T) => {
      let sorted = 0;
      let index = 0;

      while (sorted === 0 && index < sortMethodsForColumn.length) {
        sorted = sortMethodsForColumn[index++](a, b);
      }

      return sorted;
    };
  }
}
