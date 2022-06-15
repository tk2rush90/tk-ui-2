import {
  ComponentRef,
  EventEmitter,
  Injectable,
  InjectionToken,
  Injector,
  OnDestroy,
  Type,
  ViewContainerRef
} from '@angular/core';
import {OverlayOutletComponent} from '@tk-ui/components/overlay/overlay-outlet/overlay-outlet.component';
import {OverlayBackdropComponent} from '@tk-ui/components/overlay/overlay-backdrop/overlay-backdrop.component';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {RandomUtil} from '@tk-ui/utils/random.util';

/**
 * Options for opening an overlay.
 */
export interface OverlayOpenOptions<D = undefined, R = undefined> {
  /**
   * A data that pass to overlay component.
   */
  data?: D;

  /**
   * Close event handler.
   * @param res - A response.
   */
  onClose?: (res?: R) => void;

  /**
   * Injector to override default injector of overlay.
   */
  injector?: Injector;
}

/**
 * A service to manage overlay.
 */
@Injectable({
  providedIn: 'root',
})
export class OverlayService implements OnDestroy {
  /**
   * The overlay outlet component.
   */
  private _overlayOutlet?: OverlayOutletComponent;

  /**
   * Opened overlays.
   */
  private _openedOverlays: OverlayRef<any>[] = [];

  constructor(
    private _subscriptionService:  SubscriptionService,
  ) {
  }

  /**
   * Get the `ViewContainerRef` of `OverlayOutletComponent`.
   */
  get viewContainerRef(): ViewContainerRef | undefined {
    return this._overlayOutlet?.viewContainerRef;
  }

  /**
   * Get state of having opened overlays.
   */
  get hasOpenedOverlays(): boolean {
    return Object.keys(this._openedOverlays).length > 0;
  }

  ngOnDestroy(): void {
    this.unregisterOverlayOutlet();
  }

  /**
   * Register the overlay outlet.
   * @param outlet - The outlet component.
   */
  registerOverlayOutlet(outlet: OverlayOutletComponent): void {
    // Only a single outlet can be registered.
    // If trying to register outlet when there's already registered outlet,
    // throw the error.
    if (this._overlayOutlet) {
      throw new Error('Only a single overlay outlet can be registered');
    }

    this._overlayOutlet = outlet;
  }

  /**
   * Unregister the overlay outlet.
   */
  unregisterOverlayOutlet(): void {
    this.closeAll();
    this._overlayOutlet = undefined;
  }

  /**
   * Open overlay.
   * @param component - A component to open as an overlay.
   * @param options - Options for opening overlay.
   */
  open<C, D = undefined, R = undefined>(component: Type<C>, options: OverlayOpenOptions<D, R>): OverlayRef<C, D, R> {
    if (!this.viewContainerRef) {
      throw new Error('No `ViewContainerRef` to open overlay. Maybe overlay outlet is not registered.');
    }

    const overlayRef = new OverlayRef(
      this.viewContainerRef,
      component,
      options,
    );

    this._openedOverlays.push(overlayRef);
    this._subscribeOverlayClosed(overlayRef);

    return overlayRef;
  }

  /**
   * Close latest overlay.
   */
  closeLatest(): void {
    const overlayRef = this._openedOverlays.pop();

    if (overlayRef) {
      overlayRef.close();
    }
  }

  /**
   * Close all overlays.
   */
  closeAll(): void {
    this._openedOverlays.forEach(overlayRef => overlayRef.close());
  }

  /**
   * Subscribe closed emitter of an `OverlayRef`.
   * @param overlayRef - An `OverlayRef` to subscribe.
   */
  private _subscribeOverlayClosed(overlayRef: OverlayRef<any>): void {
    const sub = overlayRef.closed.subscribe(() => {
      this._destroyOverlayRef(overlayRef);
    });

    this._subscriptionService.store(`_subscribeOverlayClose${overlayRef.id}`, sub);
  }

  /**
   * Destroy `OverlayRef`.
   * @param overlayRef - An `OverlayRef` to destroy.
   */
  private _destroyOverlayRef<R = undefined>(overlayRef: OverlayRef<any>): void {
    const index = this._openedOverlays.indexOf(overlayRef);

    if (index !== -1) {
      this._openedOverlays.splice(index, 1);
    }

    overlayRef.backdropRef.destroy();
    overlayRef.componentRef.destroy();

    this._subscriptionService.unSubscribe(`_subscribeOverlayClosed${overlayRef.id}`);
  }
}

/**
 * An injection token for overlay data.
 */
export const OVERLAY_DATA = new InjectionToken<any>('OverlayData');

/**
 * An injection token for `OverlayRef`.
 */
export const OVERLAY_REF = new InjectionToken<OverlayRef<any>>('OverlayRef');

/**
 * Reference to an overlay component.
 */
export class OverlayRef<C, D = any, R = any> {
  /**
   * Closed emitter.
   */
  closed = new EventEmitter<void>();

  /**
   * An overlay id.
   */
  readonly id = RandomUtil.key();

  /**
   * Reference to an overlay component.
   */
  private readonly _componentRef: ComponentRef<C>;

  /**
   * Reference to an overlay backdrop.
   */
  private readonly _backdropRef: ComponentRef<OverlayBackdropComponent>;

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _component: Type<C>,
    private _options: OverlayOpenOptions<D, R>,
  ) {
    const injector = this._createInjector();

    // Create backdrop.
    this._backdropRef = this._viewContainerRef.createComponent(OverlayBackdropComponent, {
      injector,
    });

    this._backdropRef.changeDetectorRef.detectChanges();

    // Create component.
    this._componentRef = this._viewContainerRef.createComponent(this._component, {
      injector,
    });

    this._componentRef.changeDetectorRef.detectChanges();
  }

  /**
   * Getter for `_componentRef`.
   */
  get componentRef(): ComponentRef<C> {
    return this._componentRef;
  }

  /**
   * Getter for `_backdropRef`.
   */
  get backdropRef(): ComponentRef<OverlayBackdropComponent> {
    return this._backdropRef;
  }

  /**
   * Emit closed emitter of this overlay.
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
          provide: OVERLAY_DATA,
          useValue: this._options.data,
        },
        {
          provide: OVERLAY_REF,
          useValue: this,
        },
      ],
      parent: this._viewContainerRef.injector,
    });
  }
}
