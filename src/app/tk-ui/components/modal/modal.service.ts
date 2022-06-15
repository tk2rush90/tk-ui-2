import {ComponentRef, EventEmitter, Injectable, InjectionToken, Injector, Type, ViewContainerRef} from '@angular/core';
import {ModalBackdropComponent} from '@tk-ui/components/modal/modal-backdrop/modal-backdrop.component';
import {Modal} from '@tk-ui/components/modal/modal/modal.component';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {ModalContainerComponent} from '@tk-ui/components/modal/modal-container/modal-container.component';
import {ModalOutletComponent} from '@tk-ui/components/modal/modal-outlet/modal-outlet.component';

/**
 * Modal creation options.
 * Generic `C` is component type to create.
 * Generic `D` is data to pass to modal component.
 * Generic `R` is returning data type of modal.
 */
export interface ModalOpenOptions<D = any, R = any> {
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

  /**
   * Injector to override default injector of modal.
   */
  injector?: Injector;
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
   * A modal outlet.
   */
  private _modalOutlet?: ModalOutletComponent;

  /**
   * A list of opened `ModalRef`.
   */
  private _openedModals: ModalRef<any>[] = [];

  constructor(
    private _subscriptionService: SubscriptionService,
  ) { }

  /**
   * Get the `ViewContainerRef` of `ModalOutletComponent`.
   */
  get viewContainerRef(): ViewContainerRef | undefined {
    return this._modalOutlet?.viewContainerRef;
  }

  /**
   * Get state of having opened modals.
   */
  get hasOpenedModals(): boolean {
    return this._openedModals.length > 0;
  }

  /**
   * Register the modal outlet.
   * @param outlet - The outlet component.
   */
  registerModalOutlet(outlet: ModalOutletComponent): void {
    // Only a single outlet can be registered.
    // If trying to register outlet when there's already registered outlet,
    // throw the error.
    if (this._modalOutlet) {
      throw new Error('Only a single modal outlet can be registered');
    }

    this._modalOutlet = outlet;
  }

  /**
   * Unregister the modal outlet.
   */
  unregisterModalOutlet(): void {
    this.closeAll();
    this._modalOutlet = undefined;
  }

  /**
   * Open a modal component.
   * @param component
   * @param options
   */
  open<C extends Modal, D = any, R = any>(component: Type<C>, options: ModalOpenOptions<D, R>): ModalRef<C, D, R> {
    if (!this.viewContainerRef) {
      throw new Error('No `ViewContainerRef` to open modal. Maybe modal outlet is not registered.');
    }

    const modalRef = new ModalRef(
      this.viewContainerRef,
      component,
      options,
    );

    this._openedModals.push(modalRef);
    this._subscribeModalClosed(modalRef);


    return modalRef;
  }

  /**
   * Close latest modal.
   * @param force - Force to close the latest modal. It will ignore `preventClosing` option.
   */
  closeLatest(force = false): void {
    const modalRef = this._openedModals.pop();

    if (modalRef) {
      // When modal has `preventClosing` to `true`, only can be closed with `force` option.
      if (modalRef.preventClosing) {
        if (force) {
          modalRef.close();
        }
      } else {
        modalRef.close();
      }
    }
  }

  /**
   * Close all modals.
   */
  closeAll(): void {
    this._openedModals.forEach(modalRef => modalRef.close());
  }

  /**
   * Subscribe `closed` emitter of modal.
   * @param modalRef - A modal to subscribe.
   */
  private _subscribeModalClosed(modalRef: ModalRef<any>): void {
    const sub = modalRef.closed.subscribe(() => {
      this._destroyModalRef(modalRef);
    });

    this._subscriptionService.store(`_subscribeModalClosed${modalRef.id}`, sub);
  }

  /**
   * Destroy `ModalRef`.
   * @param modalRef - An `ModalRef` to destroy.
   */
  private _destroyModalRef<R = undefined>(modalRef: ModalRef<any>): void {
    const index = this._openedModals.indexOf(modalRef);

    if (index !== -1) {
      this._openedModals.splice(index, 1);
    }

    modalRef.backdropRef.destroy();
    modalRef.containerRef.destroy();

    this._subscriptionService.unSubscribe(`_subscribeModalClosed${modalRef.id}`);
  }
}

/**
 * Injection token of `ModalRef`.
 */
export const MODAL_REF = new InjectionToken<ModalRef<any>>('ModalRef');

/**
 * Injection token of data for a modal.
 */
export const MODAL_DATA = new InjectionToken<any>('ModalData');

/**
 * The `ModalRef` refers to created modal.
 */
export class ModalRef<C extends Modal, D = any, R = any> {
  /**
   * Closed emitter.
   */
  closed = new EventEmitter<void>();

  /**
   * A modal id.
   */
  readonly id = RandomUtil.key();

  /**
   * Reference to a modal component.
   */
  private readonly _componentRef: ComponentRef<C>;

  /**
   * Reference to a modal container.
   */
  private readonly _containerRef: ComponentRef<ModalContainerComponent>;

  /**
   * Reference to a modal backdrop.
   */
  private readonly _backdropRef: ComponentRef<ModalBackdropComponent>;

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _component: Type<C>,
    private _options: ModalOpenOptions<D, R>,
  ) {
    const injector = this._createInjector();

    // Create backdrop.
    this._backdropRef = this._viewContainerRef.createComponent(ModalBackdropComponent);
    this._backdropRef.changeDetectorRef.detectChanges();

    // Create container.
    this._containerRef = this._viewContainerRef.createComponent(ModalContainerComponent, {
      injector,
    });

    this._containerRef.changeDetectorRef.detectChanges();

    // Create component. A component will be wrapped in the container.
    this._componentRef = this._containerRef.instance.viewContainerRef.createComponent(this._component, {
      injector,
    });

    this._componentRef.changeDetectorRef.detectChanges();
  }

  /**
   * Get state of preventing closing.
   */
  get preventClosing(): boolean {
    return this._options.preventClosing || false;
  }

  /**
   * Getter for `_componentRef`.
   */
  get componentRef(): ComponentRef<C> {
    return this._componentRef;
  }

  /**
   * Getter for `_containerRef`.
   */
  get containerRef(): ComponentRef<ModalContainerComponent> {
    return this._containerRef;
  }

  /**
   * Getter for `_backdropRef`.
   */
  get backdropRef(): ComponentRef<any> {
    return this._backdropRef;
  }

  /**
   * Emit closed emitter of this modal.
   * @param result - The result data.
   */
  close(result?: R): void {
    if (this._options.onClose) {
      this._options.onClose(result);
    }

    this.closed.emit();
  }

  /**
   * Create an injector.
   */
  private _createInjector(): Injector {
    return this._options.injector || Injector.create({
      providers: [
        {
          provide: MODAL_DATA,
          useValue: this._options.data,
        },
        {
          provide: MODAL_REF,
          useValue: this,
        },
      ],
      parent: this._viewContainerRef.injector,
    });
  }
}
