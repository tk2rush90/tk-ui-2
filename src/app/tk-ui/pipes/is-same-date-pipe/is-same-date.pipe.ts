import {Pipe, PipeTransform} from '@angular/core';
import {DateUtil} from '@tk-ui/utils/date.util';

/**
 * This pipe compares 2 dates and return `true` when they are same.
 * It uses `DateUtil.isSame()` method.
 */
@Pipe({
  name: 'isSameDate'
})
export class IsSameDatePipe implements PipeTransform {

  /**
   * Compare 2 dates with `DateUtil.isSame()` method.
   * @param value - Date 1.
   * @param compare - Date 2.
   */
  transform(value: Date, compare?: Date): boolean {
    return DateUtil.isSame(value, compare);
  }

}
