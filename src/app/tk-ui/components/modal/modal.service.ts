import {ComponentRef, EventEmitter, Injectable, Injector, Type, ViewContainerRef} from '@angular/core';
import {ObjectMap} from '@tk-ui/others/types';
import {ModalOutletComponent} from '@tk-ui/components/modal/modal-outlet/modal-outlet.component';
import {ModalGroupComponent} from '@tk-ui/components/modal/modal-group/modal-group.component';
import {ModalBackdropComponent} from '@tk-ui/components/modal/modal-backdrop/modal-backdrop.component';
import {combineLatest} from 'rxjs';
import {Modal} from '@tk-ui/components/modal/modal/modal.component';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {ModalContainerComponent} from '@tk-ui/components/modal/modal-container/modal-container.component';

/**
 * Modal creation options.
 * Generic `C` is component type to create.
 * Generic `D` is data to pass to modal component.
 * Generic `R` is returning data type of modal.
 */
export interface ModalOptions<C extends Modal, D = undefined, R = any> {
  /**
   * The component to create as a modal.
   */
  component: Type<C>;

  /**
   * The data to pass to modal.
   */
  data?: D;

  /**
   * Set `true` to prevent user to close the modal by clicking backdrop or pressing `Escape`.
   */
  preventClosing?: boolean;

  /**
   * The callback function which will be called after modal closed.
   * @param res - The response data.
   */
  onClose?: (res?: R) => void;
}

/**
 * `ModalService` is working from the root level.
 * No need to provide this service in a Module or a Component.
 * The global `SubscriptionService` is required.
 */
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  /**
   * The map of registered `ViewContainerRef`.
   * The key is `id` of each `ModalOutletComponent`.
   */
  private _containerRefs: ObjectMap<ViewContainerRef> = {};

  /**
   * The map of created modals.
   * Modals are grouped by `id` of `ModalOutletComponent`.
   */
  private _modalRefs: ObjectMap<ModalRef<any, any>[]> = {};

  constructor(
    private subscriptionService: SubscriptionService,
  ) { }

  /**
   * Get state of having opened modals.
   */
  get hasOpenedModal(): boolean {
    return Object.keys(this._modalRefs).some(id => this._modalRefs[id].length > 0);
  }

  /**
   * Register the `ViewContainerRef` of modal outlet.
   * @param outlet - The modal outlet component.
   */
  registerOutlet(outlet: ModalOutletComponent): void {
    this._containerRefs[outlet.id] = outlet.viewContainerRef;
    this._modalRefs[outlet.id] = [];
  }

  /**
   * Unregister the `ModalOutlet` from service.
   * @param outlet - The modal outlet component.
   */
  unregisterOutlet(outlet: ModalOutletComponent): void {
    Object.keys(this._modalRefs).forEach(id => {
      this._modalRefs[id].forEach(modalRef => {
        // Remove subscriptions for `ModalRef`.
        this._removeModalRefSubscriptions(modalRef);
      });
    });

    // After all modals destroyed, delete the key from the map.
    delete this._modalRefs[outlet.id];
    delete this._containerRefs[outlet.id];
  }

  /**
   * Different to the overlay, modal will be rendered to all registered outlets.
   * @param options - The options to create modal.
   */
  open<C extends Modal, D = undefined, R = any>(options: ModalOptions<C, D, R>): void {
    Object.keys(this._containerRefs).forEach(id => {
      const viewContainerRef = this._containerRefs[id];

      // Create `ModalRef`.
      const modalRef = new ModalRef<C, D, R>(id, viewContainerRef, options);

      this._subscribeModalRefClose(modalRef);
      this._modalRefs[id].push(modalRef);
    });
  }

  /**
   * Close latest modal from all outlets.
   */
  closeLatest(): void {
    // Remove the latest modal from all outlets.
    Object.keys(this._modalRefs).forEach(id => this._modalRefs[id].pop()?.close());
  }

  /**
   * Close all modals from all outlets.
   */
  closeAll(): void {
    Object.keys(this._modalRefs).forEach(id => {
      this._modalRefs[id].forEach(modalRef => modalRef.close());
    });
  }

  /**
   * Subscribe for `ModalRef` close emitter.
   * @param modalRef - The `ModalRef`.
   */
  private _subscribeModalRefClose<C extends Modal, D = undefined, R = any>(modalRef: ModalRef<C, D, R>): void {
    const sub = modalRef
      .destroy
      .subscribe(() => {
        this._destroyModalContents(modalRef);
      });

    this.subscriptionService.store(`_subscribeModalRefClose${modalRef.groupId}`, sub);
  }

  /**
   * Subscribe for removed emitter of backdrop and component in `ModalRef`.
   * @param modalRef - The `ModalRef`.
   */
  private _destroyModalContents<C extends Modal, D = undefined, R = any>(modalRef: ModalRef<C, D, R>): void {
    const sub = combineLatest([
      modalRef.backdropRef.instance.removed,
      modalRef.componentRef.instance.removed,
    ]).subscribe(() => {
      // Destroy `ModalGroup` and `ModalContainer` after all contents destroyed.
      modalRef.groupRef.destroy();
      modalRef.containerRef.destroy();

      this._removeClosedModalRef(modalRef);
      this._removeModalRefSubscriptions(modalRef);
      this._focusToLatestModal(modalRef.outletId);
    });

    modalRef.backdropRef.destroy();
    modalRef.componentRef.destroy();

    this.subscriptionService.store(`_destroyModalGroup${modalRef.groupId}`, sub);
  }

  private _removeModalRefSubscriptions<C extends Modal, D = undefined, R = any>(modalRef: ModalRef<C, D, R>): void {
    this.subscriptionService.unSubscribe(`_subscribeModalRefClose${modalRef.groupId}`);
    this.subscriptionService.unSubscribe(`_destroyModalGroup${modalRef.groupId}`);
  }

  /**
   * Remove closed modal from `_modalRef` map.
   * @param modalRef - Closed `ModalRef`.
   */
  private _removeClosedModalRef<C extends Modal, D = undefined, R = any>(modalRef: ModalRef<C, D, R>): void {
    this._modalRefs[modalRef.outletId] = this._modalRefs[modalRef.outletId].filter(_modalRef => _modalRef !== modalRef);
  }

  /**
   * Focus to the latest modal.
   * @param id - The outlet id to get the latest modal.
   */
  private _focusToLatestModal(id: string): void {
    const modalRefs = this._modalRefs[id];
    const latestModalRef = modalRefs[modalRefs.length - 1];

    if (latestModalRef) {
      latestModalRef.groupRef.instance.element.focus();
    }
  }
}

/**
 * Provider keys for modal.
 */
export enum ModalProviders {
  /**
   * Refer to `ModalRef`.
   */
  ref = 'ModalRef',

  /**
   * Refer to passed modal data.
   */
  data = 'ModalData',
}

/**
 * The `ModalRef` refers to created modal.
 */
export class ModalRef<C extends Modal, D = undefined, R = any> {
  /**
   * Emitter that will be emitted when modal starts destroying.
   */
  destroy = new EventEmitter<void>();

  /**
   * The `ComponentRef` of `ModalGroupComponent`.
   */
  groupRef: ComponentRef<ModalGroupComponent>;

  /**
   * The `ComponentRef` of `ModalBackdropComponent`.
   */
  backdropRef: ComponentRef<ModalBackdropComponent>;

  /**
   * The `ComponentRef` of `ModalContainerComponent`.
   */
  containerRef: ComponentRef<ModalContainerComponent>;

  /**
   * The `ComponentRef` of created component.
   */
  componentRef: ComponentRef<C>;

  /**
   * The outlet id.
   */
  outletId: string;

  /**
   * The callback function which will be called after modal closed.
   * @param res - The response data.
   */
  private readonly _onClose?: (res?: R) => void;

  constructor(id: string, viewContainerRef: ViewContainerRef, options: ModalOptions<C, D, R>) {
    this.outletId = id;
    this._onClose = options.onClose;

    // Create injector.
    const injector = Injector.create({
      providers: [
        {
          provide: ModalProviders.ref,
          useValue: this,
        },
        {
          provide: ModalProviders.data,
          useValue: options.data,
        },
      ],
      parent: viewContainerRef.injector,
    });

    // Create group.
    this.groupRef = viewContainerRef.createComponent(ModalGroupComponent);
    this.groupRef.instance.preventClosing = options.preventClosing || false;
    this.groupRef.changeDetectorRef.detectChanges();

    // Create Backdrop and Container.
    // Backdrop and will get injector.
    this.backdropRef = this.groupRef.instance.viewContainerRef.createComponent(ModalBackdropComponent, {injector});
    this.containerRef = this.groupRef.instance.viewContainerRef.createComponent(ModalContainerComponent);
    this.backdropRef.changeDetectorRef.detectChanges();
    this.containerRef.changeDetectorRef.detectChanges();

    // Create Component.
    // Component will get injector.
    this.componentRef = this.containerRef.instance.viewContainerRef.createComponent(options.component, {injector});
    this.componentRef.changeDetectorRef.detectChanges();
  }

  /**
   * Get modal group id.
   */
  get groupId(): string {
    return this.groupRef.instance.id;
  }

  /**
   * Close the modal.
   * @param res - The response data of modal.
   */
  close(res?: R): void {
    if (this._onClose) {
      this._onClose(res);
    }

    this.destroy.emit();
  }
}
