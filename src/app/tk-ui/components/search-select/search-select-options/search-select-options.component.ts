import {Component, ElementRef, HostListener, Inject} from '@angular/core';
import {OVERLAY_DATA, OVERLAY_REF, OverlayRef} from '@tk-ui/components/overlay/overlay.service';
import {EventListenerService} from '@tk-ui/services/common/event-listener.service';
import {OptionItem} from '@tk-ui/models/option-item';
import {AvailableKey, EventUtil} from '@tk-ui/utils/event.util';
import {SelectOverlay} from '@tk-ui/bases/select-overlay/select-overlay.component';
import {InputOverlayData} from '@tk-ui/bases/input-overlay/input-overlay.component';

/**
 * Data of select options.
 */
export interface SearchSelectOptionsData extends InputOverlayData {
  /**
   * All available options.
   */
  options: OptionItem<string>[];

  /**
   * The current value.
   */
  value?: string;
}

/**
 * The select component with autocomplete feature by search text.
 */
@Component({
  selector: 'app-search-select-options',
  templateUrl: './search-select-options.component.html',
  styleUrls: ['./search-select-options.component.scss'],
  providers: [
    EventListenerService,
  ],
})
export class SearchSelectOptionsComponent extends SelectOverlay<SearchSelectOptionsData> {
  /**
   * The index of focused cursor.
   */
  cursorIndex = -1;

  /**
   * The options to display.
   * This can be changed by calling `updateOptions()` method.
   */
  options: OptionItem<string>[] = [];

  /**
   * The pending state of filtering options from outer component.
   */
  private _pending = false;

  constructor(
    @Inject(OVERLAY_REF) protected override _overlayRef: OverlayRef<SearchSelectOptionsComponent>,
    @Inject(OVERLAY_DATA) protected override _data: SearchSelectOptionsData,
    protected override _elementRef: ElementRef<HTMLElement>,
    protected override _eventListenerService: EventListenerService,
  ) {
    super(_overlayRef, _data, _elementRef, _eventListenerService);
  }

  ngOnInit(): void {
    // Extract options from data.
    this.options = this._data.options;
    this._setInitialCursorIndex();
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    // Focus to initial `cursorIndex` which is index of selected option.
    this._focusToIndex(this.cursorIndex);
  }

  /**
   * Get pending state.
   */
  get pending(): boolean {
    return this._pending;
  }

  /**
   * Get select value.
   */
  get value(): string | undefined {
    return this._data.value;
  }

  /**
   * Listen `keydown` event for user keyboard interaction.
   * @param event - The `KeyboardEvent`.
   */
  @HostListener('window:keydown', ['$event'])
  onHostKeydown(event: KeyboardEvent): void {
    if (EventUtil.isKey(event, AvailableKey.ArrowDown)) {
      // Move down the cursor.
      // The maximum of `cursorIndex` is last index of `options`.
      // After updating `cursorIndex`, move focus to the focused option item.
      EventUtil.disable(event);
      this.cursorIndex = Math.min(this.cursorIndex + 1, this.options.length - 1);
      this._focusToIndex(this.cursorIndex);

    } else if (EventUtil.isKey(event, AvailableKey.ArrowUp)) {
      // Move up the cursor.
      // The minimum of `cursorIndex` is `0`.
      // After updating `cursorIndex`, move focus to the focused option item.
      EventUtil.disable(event);
      this.cursorIndex = Math.max(this.cursorIndex - 1, 0);
      this._focusToIndex(this.cursorIndex);

    } else if (EventUtil.isKey(event, AvailableKey.Enter)) {
      // Confirm the selection.
      EventUtil.disable(event);
      this.closeOptions(this.options[this.cursorIndex]);

    } else if (
      // Detect `Escape` and `Tab` button to close the options.
      EventUtil.isKey(event, AvailableKey.Escape)
      || EventUtil.isKey(event, AvailableKey.Tab)
    ) {
      // Close the options.
      EventUtil.disable(event);
      this.closeOptions();
    }
  }

  /**
   * Clear the options overlay with response.
   * @param option - The selected option.
   */
  closeOptions(option?: OptionItem<string>): void {
    this._overlayRef.close(option?.value);
  }

  /**
   * Update the options with filtered options.
   * @param options - This should be filtered options.
   */
  updateOptions(options: OptionItem<string>[]): void {
    this.options = options;
    // Update the new cursor index as well.
    this._setInitialCursorIndex();
  }

  /**
   * Update the component position.
   */
  updatePosition(): void {
    this._setPositioningStyles();
  }

  /**
   * Start pending to get new options from the outer component.
   */
  startPending(): void {
    this._pending = true;
  }

  /**
   * Stop pending.
   */
  endPending(): void {
    this._pending = false;
  }

  /**
   * Set the initial `cursorIndex`.
   */
  private _setInitialCursorIndex(): void {
    this.cursorIndex = this.options.findIndex(option => option.value === this.value);
  }
}
