import {ComponentRef, Injectable, Injector, OnDestroy, Type, ViewContainerRef} from '@angular/core';
import {OverlayOutletComponent} from '@tk-ui/components/overlay/overlay-outlet/overlay-outlet.component';
import {ObjectMap} from '@tk-ui/others/types';
import {OverlayCoverComponent} from '@tk-ui/components/overlay/overlay-cover/overlay-cover.component';

/**
 * Create the injector for overlay content component.
 * @param viewContainerRef - The `ViewContainerRef` of `OverlayOutlet` to draw content.
 * @param options - The options for content.
 */
export function createOverlayComponentInjector<T, D>(
  viewContainerRef: ViewContainerRef,
  options: DrawingOptions<T, D>,
) {
  return Injector.create({
    providers: [
      {
        provide: OverlayProviders.id,
        useValue: options.id,
      },
      {
        provide: OverlayProviders.data,
        useValue: options.data,
      },
    ],
    parent: viewContainerRef.injector,
  });
}

/**
 * The `OverlayService` should be provided in to a Component instead of NgModule.
 * The Component which is providing `OverlayService` should contain `<overlay-outlet>` in its contents.
 */
@Injectable()
export class OverlayService implements OnDestroy {
  /**
   * The map of `ViewContainerRef` for overlay outlets.
   * The key of object is overlay id.
   */
  private _containerRefs: ObjectMap<ViewContainerRef> = {};

  /**
   * The map of overlay contents which are drawn in specific overlay.
   * The key of object is overlay id.
   */
  private _contentsRefs: ObjectMap<OverlayContentsRef<any, any>> = {};

  ngOnDestroy(): void {
    this._removeOutletContainers();
  }

  /**
   * Append overlay outlet to service.
   * @param outlet - The OverlayOutlet.
   */
  appendOverlayOutlet(outlet: OverlayOutletComponent): void {
    this._containerRefs[outlet.id] = outlet.viewContainerRef;
  }

  /**
   * Remove overlay outlet from service.
   * @param outlet - The OverlayOutlet.
   */
  removeOverlayOutlet(outlet: OverlayOutletComponent): void {
    if (this._containerRefs[outlet.id]) {
      this.clearOverlay(outlet.id);

      delete this._containerRefs[outlet.id];
    }
  }

  /**
   * Draw component to an overlay.
   * For generics, see `DrawingOptions` interface.
   * Every overlay component is responsible for setting its position.
   * A developer needs to implement positioning method in the overlay component.
   * @param options - Options of overlay group.
   */
  drawComponent<C, D = undefined, R = any>(options: DrawingOptions<C, D, R>): OverlayContentsRef<C, R> | null {
    const viewContainerRef = this._containerRefs[options.id];

    if (viewContainerRef) {
      // Clear previous overlay.
      this.clearOverlay(options.id);

      const injector = createOverlayComponentInjector(viewContainerRef, options);
      const overlayCoverRef = viewContainerRef.createComponent(OverlayCoverComponent, {injector});
      const componentRef = viewContainerRef.createComponent(options.component, {injector});

      // Call detect changes to initialize the components.
      overlayCoverRef.changeDetectorRef.detectChanges();
      componentRef.changeDetectorRef.detectChanges();

      this._contentsRefs[options.id] = new OverlayContentsRef<C, R>(componentRef, overlayCoverRef, options.onClose);

      return this._contentsRefs[options.id];
    }

    return null;
  }

  /**
   * Clear the overlay.
   * @param id - The overlay id.
   * @param response - The response.
   */
  clearOverlay(id: string, response?: any): void {
    const contents = this._contentsRefs[id];

    if (contents) {
      contents.destroy(response);

      delete this._contentsRefs[id];
    }
  }

  /**
   * Remove all outlet containers.
   */
  private _removeOutletContainers(): void {
    for (let key in this._containerRefs) {
      this.clearOverlay(key);

      delete this._containerRefs[key];
    }
  }
}

/**
 * The options for `drawComponent()` method of `OverlayService`.
 * Generic `C` to be `component`, `D` to be `data`, `R` to be return value of `onClose()` callback function.
 */
export interface DrawingOptions<C, D = undefined, R = any> {
  /**
   * The `id` of an overlay to draw the component.
   */
  id: string;

  /**
   * The component to draw in overlay.
   */
  component: Type<C>;

  /**
   * The data needs to be passed to a component.
   */
  data?: D;

  /**
   * Callback function to handle close event.
   * @param res - The response.
   */
  onClose?: (res: R) => void;
}

/**
 * The enum for providers of drawing component.
 */
export enum OverlayProviders {
  /**
   * Refer to overlay id.
   */
  id = 'OverlayId',

  /**
   * Refer to passed data.
   */
  data = 'OverlayData',
}

/**
 * Data class for drawn component and its cover.
 * Generic `C` to be `component`, `R` to be return value of `onClose()` callback function.
 */
export class OverlayContentsRef<C, R> {
  /**
   * Drawn component on overlay.
   */
  private readonly _component: ComponentRef<C>;

  /**
   * `OverlayCover` for drawn component.
   */
  private readonly _cover: ComponentRef<OverlayCoverComponent>;

  /**
   * Close callback function.
   */
  private readonly _onClose?: (res: R) => void;

  constructor(component: ComponentRef<C>, cover: ComponentRef<OverlayCoverComponent>, onClose?: (res: R) => void) {
    this._component = component;
    this._cover = cover;
    this._onClose = onClose;
  }

  /**
   * Get contents component.
   */
  get component(): ComponentRef<C> {
    return this._component;
  }

  /**
   * Get `OverlayCover`.
   */
  get cover(): ComponentRef<OverlayCoverComponent> {
    return this._cover;
  }

  /**
   * Destroy the contents component and cover.
   * @param response - The response.
   */
  destroy(response?: R): void {
    this._component.destroy();
    this._cover.destroy();

    if (this._onClose) {
      this._onClose(response as any);
    }
  }
}
