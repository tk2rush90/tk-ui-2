import {Component, ElementRef, HostListener, Inject, OnInit} from '@angular/core';
import {OptionItem} from '@tk-ui/models/option-item';
import {OverlayProviders, OverlayService} from '@tk-ui/components/overlay/overlay.service';
import {EventListenerService} from '@tk-ui/services/common/event-listener.service';
import {ObjectMap} from '@tk-ui/others/types';
import {AvailableKey, EventUtil} from '@tk-ui/utils/event.util';
import {ObjectUtil} from '@tk-ui/utils/object.util';
import {SelectOverlay} from '@tk-ui/bases/select-overlay/select-overlay.component';
import {InputOverlayData} from '@tk-ui/bases/input-overlay/input-overlay.component';

/**
 * Data of select options.
 */
export interface MultiSelectOptionsData extends InputOverlayData {
  /**
   * All available options.
   */
  options: OptionItem<string>[];

  /**
   * The current value of `MultiSelectComponent`.
   * It only used to initialize the `valuesMap` and `selectedOptions` of `MultiSelectOptionsComponent`.
   */
  value: string[];

  /**
   * The callback function to handle value change.
   * @param options - The changed value.
   */
  onChange: (options: string[]) => void;
}

/**
 * The options component for `MultiSelectComponent`.
 * It creates `valuesMap` with `value` of passed `data`.
 * And, the `selectedOptions` will be initialized as well.
 * After then, `valuesMap` and `selectedOptions` will be managed only by this component.
 * It doesn't use the passed `value` data anymore.
 * It only calls `onChange()` callback function to change the `MultiSelectComponent`'s value.
 *
 */
@Component({
  selector: 'app-multi-select-options',
  templateUrl: './multi-select-options.component.html',
  styleUrls: ['./multi-select-options.component.scss'],
  providers: [
    EventListenerService,
  ],
})
export class MultiSelectOptionsComponent extends SelectOverlay<MultiSelectOptionsData> implements OnInit {
  /**
   * The index of focused cursor.
   */
  cursorIndex = -1;

  /**
   * The map of values of selected options.
   */
  valuesMap: ObjectMap<boolean> = {};

  /**
   * Selected options.
   */
  private _selectedOptions: OptionItem<string>[] = [];

  constructor(
    @Inject(OverlayProviders.id) protected override id: string,
    @Inject(OverlayProviders.data) protected override data: MultiSelectOptionsData,
    protected override elementRef: ElementRef<HTMLElement>,
    protected override overlayService: OverlayService,
    protected override eventListenerService: EventListenerService,
  ) {
    super(id, data, elementRef, overlayService, eventListenerService);
  }

  ngOnInit(): void {
    this._initSelectedOptions();
  }

  /**
   * Get select value.
   */
  get value(): string[] {
    return this.data.value;
  }

  /**
   * Get all options.
   */
  get options(): OptionItem<string>[] {
    return this.data.options;
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
      // Toggle option selection.
      EventUtil.disable(event);
      this.toggleOptionSelection(this.options[this.cursorIndex]);

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
    this.overlayService.clearOverlay(this.id, option?.value);
  }

  /**
   * Toggle the selection of option.
   * @param option - The option to toggle.
   */
  toggleOptionSelection(option: OptionItem<string>): void {
    const optionIndex = this._selectedOptions.findIndex(_option => _option === option);

    if (optionIndex !== -1) {
      this._selectedOptions.splice(optionIndex, 1);
    } else {
      this._selectedOptions.push(option);
    }

    this.data.onChange(this._selectedOptions.map(_option => _option.value));
    this._updateValuesMap();
  }

  /**
   * Initialize the selected options with `value` in `data`.
   */
  private _initSelectedOptions(): void {
    this.valuesMap = ObjectUtil.getUniqueKeys(this.value);

    this._selectedOptions = this.options.filter(option => this.valuesMap[option.value]);
  }

  /**
   * Update the map of values of selected options.
   */
  private _updateValuesMap(): void {
    this.valuesMap = ObjectUtil.getUniqueKeys(this._selectedOptions, 'value');
  }
}
