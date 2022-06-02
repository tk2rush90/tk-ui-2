import {AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {ModalService} from '@tk-ui/components/modal/modal.service';

/**
 * The `ModalOutlet` should be placed in the root component
 * where the modals need to be rendered.
 */
@Component({
  selector: 'app-modal-outlet',
  templateUrl: './modal-outlet.component.html',
  styleUrls: ['./modal-outlet.component.scss'],
})
export class ModalOutletComponent implements AfterViewInit, OnDestroy {
  /**
   * `ViewContainerRef` for `ng-container`.
   */
  @ViewChild('container', {read: ViewContainerRef}) viewContainerRef!: ViewContainerRef;

  /**
   * Use random key for id.
   */
  id = RandomUtil.key();

  constructor(
    private modalService: ModalService,
  ) {
  }

  ngAfterViewInit(): void {
    this.modalService.registerOutlet(this);
  }

  ngOnDestroy(): void {
    this.modalService.unregisterOutlet(this);
  }
}
