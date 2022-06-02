import {Component, ElementRef, HostBinding, Inject, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import {OverlayProviders, OverlayService} from '@tk-ui/components/overlay/overlay.service';
import {EventListenerService} from '@tk-ui/services/common/event-listener.service';
import {EventUtil} from '@tk-ui/utils/event.util';
import {InputOverlay, InputOverlayData} from '@tk-ui/bases/input-overlay/input-overlay.component';

/**
 * The base class for select options component.
 * It's extended in `SelectOptions`, `MultiSelectOptions`, and `SearchSelectOptions`.
 * Do not try to render this as a Component without extending.
 * Generic `D` is injected data type.
 */
@Component({
  selector: 'app-select-options-base',
  template: '',
  providers: [
    EventListenerService,
  ],
})
export class SelectOverlay<D extends InputOverlayData> extends InputOverlay implements OnDestroy {
  /**
   * Refer to the option items.
   * There must be `#optionItem` in the html template of extended component.
   */
  @ViewChildren('optionItem', {read: ElementRef}) optionItemRefs!: QueryList<ElementRef<HTMLElement>>;

  /**
   * The `width` of options.
   */
  private _width = 0;

  /**
   * The Timeout timer for positioning and animation to prevent Angular error.
   */
  private _positioningTimer: any;

  constructor(
    @Inject(OverlayProviders.id) protected override id: string,
    @Inject(OverlayProviders.data) protected override data: D,
    protected override elementRef: ElementRef<HTMLElement>,
    protected override overlayService: OverlayService,
    protected override eventListenerService: EventListenerService,
  ) {
    super(id, data, elementRef, overlayService, eventListenerService);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    // Set position and start animation.
    this._positioningTimer = setTimeout(() => {
      this._setPositioningStyles();
      this._startAnimation();
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this._positioningTimer);
  }

  /**
   * Bind width style.
   */
  @HostBinding('style.width')
  get width(): string {
    return `${this._width}px`;
  }

  /**
   * Focus to specific option with index.
   * @param focusIndex - The index to focus.
   */
  protected _focusToIndex(focusIndex: number): void {
    const optionItemRef = this.optionItemRefs.get(focusIndex);

    if (optionItemRef) {
      EventUtil.scrollToCenter(optionItemRef.nativeElement);
    }
  }

  /**
   * Set the positioning styles to display options.
   */
  protected _setPositioningStyles(): void {
    const buttonRect = this.data.button.getBoundingClientRect();
    const elementRect = this.element.getBoundingClientRect();

    this._width = buttonRect.width;
    this._x = buttonRect.x;

    this._calculateYPosition(buttonRect, elementRect);
  }
}
