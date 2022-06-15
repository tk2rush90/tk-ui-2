import {Component, ElementRef, HostListener, Inject, OnInit} from '@angular/core';
import {OVERLAY_DATA, OVERLAY_REF, OverlayRef} from '@tk-ui/components/overlay/overlay.service';
import {OptionItem} from '@tk-ui/models/option-item';
import {EventListenerService} from '@tk-ui/services/common/event-listener.service';
import {AvailableKey, EventUtil} from '@tk-ui/utils/event.util';
import {SelectOverlay} from '@tk-ui/bases/select-overlay/select-overlay.component';
import {InputOverlayData} from '@tk-ui/bases/input-overlay/input-overlay.component';

/**
 * Data of select options.
 */
export interface SelectOptionsData extends InputOverlayData {
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
 * The options for `SelectComponent`.
 */
@Component({
  selector: 'app-select-options',
  templateUrl: './select-options.component.html',
  styleUrls: ['./select-options.component.scss'],
  providers: [
    EventListenerService,
  ],
})
export class SelectOptionsComponent extends SelectOverlay<SelectOptionsData> implements OnInit {
  /**
   * The index of focused cursor.
   */
  cursorIndex = -1;

  constructor(
    @Inject(OVERLAY_REF) protected override _overlayRef: OverlayRef<SelectOptionsComponent, SelectOptionsData, string>,
    @Inject(OVERLAY_DATA) protected override _data: SelectOptionsData,
    protected override _elementRef: ElementRef<HTMLElement>,
    protected override _eventListenerService: EventListenerService,
  ) {
    super(_overlayRef, _data, _elementRef, _eventListenerService);
  }

  ngOnInit(): void {
    this._setInitialCursorIndex();
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    // Focus to initial `cursorIndex` which is index of selected option.
    this._focusToIndex(this.cursorIndex);
  }

  /**
   * Get select value.
   */
  get value(): string | undefined {
    return this._data.value;
  }

  /**
   * Get all options.
   */
  get options(): OptionItem<string>[] {
    return this._data.options;
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

    } else if (
      EventUtil.isKey(event, AvailableKey.Enter)
      || EventUtil.isKey(event, AvailableKey.Space)
    ) {
      // Confirm the selection.
      EventUtil.disable(event);
      this.closeOptions(this.options[this.cursorIndex]);

    } else if (EventUtil.isKey(event, AvailableKey.Escape)) {
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
   * Set the initial `cursorIndex`.
   */
  private _setInitialCursorIndex(): void {
    this.cursorIndex = this.options.findIndex(option => option.value === this.value);
  }
}
