import {
  AfterViewInit,
  Component,
  HostBinding,
  HostListener,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {ModalService} from '@tk-ui/components/modal/modal.service';
import {AvailableKey, EventUtil} from '@tk-ui/utils/event.util';

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
    private _modalService: ModalService,
  ) {
  }

  /**
   * Bind opened state to class.
   */
  @HostBinding('class.tk-has-opened') get hasOpened(): boolean {
    return this._modalService.hasOpenedModals;
  }

  ngAfterViewInit(): void {
    this._modalService.registerModalOutlet(this);
  }

  ngOnDestroy(): void {
    this._modalService.unregisterModalOutlet();
  }

  /**
   * Listen window keydown event to close the latest outlet.
   * @param event - The `KeyboardEvent`.
   */
  @HostListener('window:keydown', ['$event'])
  onWindowKeydown(event: KeyboardEvent): void {
    if (EventUtil.isKey(event, AvailableKey.Escape)) {
      this._modalService.closeLatest();
    }
  }
}
