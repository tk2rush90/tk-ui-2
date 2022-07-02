import {ComponentRef, Injectable, InjectionToken, Injector, Type, ViewContainerRef} from '@angular/core';
import {Modal} from '@tk-ui/components/modal/modal/modal.component';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {ModalContainerComponent} from '@tk-ui/components/modal/modal-container/modal-container.component';
import {OverlayOpenOptions, OverlayRef, OverlayService} from '@tk-ui/components/overlay/overlay.service';
import {ModalBackdropComponent} from '@tk-ui/components/modal/modal-backdrop/modal-backdrop.component';

/**
 * Modal creation options.
 * Generic `C` is component type to create.
 * Generic `D` is data to pass to modal component.
 * Generic `R` is returning data type of modal.
 */
export interface ModalOpenOptions<D = any, R = any> extends OverlayOpenOptions<D, R> {
  /**
   * Set `true` to prevent user to close the modal by clicking backdrop or pressing `Escape`.
   */
  preventClosing?: boolean;
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

  constructor(
    private _overlayService: OverlayService,
    private _subscriptionService: SubscriptionService,
  ) { }

  /**
   * Get the `ViewContainerRef` of `ModalOutletComponent`.
   */
  get viewContainerRef(): ViewContainerRef | undefined {
    return this._overlayService.viewContainerRef;
  }

  /**
   * Get state of having opened modals.
   */
  get hasOpenedModals(): boolean {
    return this.openedModals.length > 0;
  }

  /**
   * Get opened modals.
   */
  get openedModals(): ModalRef<any>[] {
    return this._overlayService
      .openedOverlays
      .filter(overlayRef => overlayRef instanceof ModalRef) as ModalRef<any>[];
  }

  /**
   * Open a modal component.
   * @param component
   * @param options
   */
  open<C extends Modal, D = any, R = any>(component: Type<C>, options: ModalOpenOptions<D, R>): ModalRef<C, D, R> {
    if (!this.viewContainerRef) {
      throw new Error('No `ViewContainerRef` to open modal. Maybe overlay outlet is not registered.');
    }

    const modalRef = new ModalRef(
      this.viewContainerRef,
      {
        ...options,
        backdrop: ModalBackdropComponent,
      },
      component,
    );

    this._overlayService.addOpenedOverlay(modalRef);

    return modalRef;
  }

  /**
   * Close latest modal.
   * @param force - Force to close the latest modal. It will ignore `preventClosing` option.
   */
  closeLatest(force = false): void {
    const modalRef = this.openedModals.pop();

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
    this.openedModals.forEach(modalRef => modalRef.close());
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
export class ModalRef<C extends Modal, D = any, R = any> extends OverlayRef<ModalContainerComponent, D, R> {
  /**
   * Reference to a modal container.
   */
  private readonly _contentsRef: ComponentRef<C>;

  constructor(
    protected override _viewContainerRef: ViewContainerRef,
    protected override _options: ModalOpenOptions<D, R>,
    private _contents: Type<C>,
  ) {
    super(
      _viewContainerRef,
      ModalContainerComponent,
      _options,
    );

    // Create component. A component will be wrapped in the container.
    this._contentsRef = this._componentRef.instance.viewContainerRef.createComponent(this._contents, {
      injector: this._createInjector(),
    });

    this._contentsRef.changeDetectorRef.detectChanges();
  }

  /**
   * Get state of preventing closing.
   */
  get preventClosing(): boolean {
    return this._options.preventClosing || false;
  }

  /**
   * Getter for `_contentsRef`.
   */
  get contentsRef(): ComponentRef<C> {
    return this._contentsRef;
  }

  /**
   * Create an injector.
   */
  protected override _createInjector(): Injector {
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
