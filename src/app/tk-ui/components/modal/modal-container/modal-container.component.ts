import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {RandomUtil} from '@tk-ui/utils/random.util';

@Component({
  selector: 'app-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.scss']
})
export class ModalContainerComponent {
  /**
   * `ViewContainerRef` for `ng-container`.
   */
  @ViewChild('container', {read: ViewContainerRef}) viewContainerRef!: ViewContainerRef;

  /**
   * Use random key for id.
   */
  id = RandomUtil.key();
}
