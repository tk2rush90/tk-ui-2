import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Optional,
  Output,
  Self,
  ViewChild
} from '@angular/core';
import {OverlayOutletComponent} from '@tk-ui/components/overlay/overlay-outlet/overlay-outlet.component';
import {OptionItem} from '@tk-ui/models/option-item';
import {OverlayContentsRef, OverlayService} from '@tk-ui/components/overlay/overlay.service';
import {NgControl} from '@angular/forms';
import {CustomFormControl} from '@tk-ui/bases/custom-form-control/custom-form-control.directive';
import {
  SearchSelectOptionsComponent,
  SearchSelectOptionsData
} from '@tk-ui/components/search-select/search-select-options/search-select-options.component';
import {AvailableKey, EventUtil} from '@tk-ui/utils/event.util';
import {StringUtil} from '@tk-ui/utils/string.util';

/**
 * Search select component.
 * The subject of event is `input` not like to other select-like components.
 * Every event is bound to `input` element.
 */
@Component({
  selector: 'app-search-select',
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.scss'],
  providers: [
    OverlayService,
  ],
})
export class SearchSelectComponent extends CustomFormControl<string> {
  /**
   * Placeholder.
   */
  @Input() placeholder = '';

  /**
   * Set this value to `false` to make component can't filter options by itself.
   */
  @Input() standalone = true;

  /**
   * Search change emitter.
   * It will be emitted when user input something to search and the component's `standalone` property is `false`.
   */
  @Output() searchChange = new EventEmitter<string>();

  /**
   * Refer to OverlayOutlet.
   */
  @ViewChild(OverlayOutletComponent) overlayOutlet!: OverlayOutletComponent;

  /**
   * Refer to the select toggle button.
   */
  @ViewChild('button', {read: ElementRef}) buttonRef!: ElementRef<HTMLElement>;

  /**
   * Refer to the input element.
   */
  @ViewChild('input', {read: ElementRef}) inputRef!: ElementRef<HTMLInputElement>;

  /**
   * Make the component cannot be focused.
   */
  @HostBinding('attr.tabindex') override tabindex = -1;

  /**
   * Disabled state.
   */
  disabled = false;

  /**
   * The focused state.
   * User only can search when this value is `true`.
   */
  private _focused = false;

  /**
   * The search text.
   */
  private _search = '';

  /**
   * Selected option.
   */
  private _selectedOption?: OptionItem<string>;

  /**
   * The selected value.
   */
  private _value = '';

  /**
   * Available options.
   */
  private _options: OptionItem<string>[] = [];

  /**
   * The overlay contents for options.
   */
  private _optionsOverlayContentsRef: OverlayContentsRef<SearchSelectOptionsComponent, string | undefined> | null = null;

  constructor(
    @Self() @Optional() public override ngControl: NgControl,
    private elementRef: ElementRef<HTMLElement>,
    private overlayService: OverlayService,
  ) {
    super(ngControl);
  }

  /**
   * Set pending state to `true` while updating filtered options when `standalone` is `false`.
   * @param pending - The pending state.
   */
  @Input()
  set pending(pending: boolean) {
    if (pending) {
      this._optionsOverlayContentsRef?.component.instance.startPending();
    } else {
      this._optionsOverlayContentsRef?.component.instance.endPending();
    }
  }

  /**
   * Set options for select.
   * @param options - Options.
   */
  @Input()
  set options(options: OptionItem<string>[]) {
    this._options = options;
    this._updateSelectedOption();

    // When the `standalone` state is `false`,
    // `options` must be filtered options by user input.
    this._updateFilteredOptionsAndPosition(options);
  }

  /**
   * Get options opened state and bind to `tk-opened` class.
   */
  @HostBinding('class.tk-opened')
  get opened(): boolean {
    return !!this._optionsOverlayContentsRef;
  }

  /**
   * Get label string for input element.
   */
  get label(): string {
    if (this._focused) {
      return this._search;
    } else {
      return this._selectedOption?.label || '';
    }
  }

  /**
   * Get current value.
   */
  get value(): string {
    return this._value;
  }

  /**
   * Get host element.
   */
  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  /**
   * Write selected value.
   * @param value - The value.
   */
  override writeValue(value: string): void {
    this._value = value;
    this._updateSelectedOption();
  }

  /**
   * Set select disabled state.
   * @param isDisabled - Disabled state.
   */
  override setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Listen input `keydown` event to make user can toggle options.
   * @param event - The `KeyboardEvent`.
   */
  onInputKeydown(event: KeyboardEvent): void {
    if (
      !this.opened
      // Allow `ArrowDown`, `ArrowUp` to open options.
      && (
        EventUtil.isKey(event, AvailableKey.ArrowDown)
        || EventUtil.isKey(event, AvailableKey.ArrowUp)
      )
    ) {
      EventUtil.disable(event);

      this.openOptions();
    }
  }

  /**
   * Update the `_search` when input is focused.
   * @param search - The search value.
   */
  onInputChange(search: string): void {
    this._search = search;
    this.openOptions();

    if (this.standalone) {
      const filteredOptions = this._options.filter(option => StringUtil.contains(option.label, this._search));

      this._updateFilteredOptionsAndPosition(filteredOptions);
    } else {
      this._emitSearchChange();
    }
  }

  /**
   * Open options.
   */
  openOptions(): void {
    if (!this.opened && !this.disabled) {
      // When opening options, set `_focused` state to `true` to show
      // `_search` value in `input` element.
      this._focused = true;

      this._optionsOverlayContentsRef = this.overlayService
        .drawComponent<SearchSelectOptionsComponent, SearchSelectOptionsData, string | undefined>({
          id: this.overlayOutlet.id,
          component: SearchSelectOptionsComponent,
          data: {
            options: this._options,
            value: this._value,
            button: this.buttonRef.nativeElement,
          },
          onClose: res => {
            if (res) {
              this.setValue(res);
            }

            // Clear `_focused` state and `_search` text.
            this._search = '';
            this._focused = false;
            this._optionsOverlayContentsRef = null;

            this.markAsTouched();
            this._emitSearchChange();
          },
        });
    }
  }

  /**
   * Update the `_selectedOption` by searching option from `_options` with `_value`.
   * This should be called from both `writeValue()` and `set options()` because
   * the `_value` and `_options` may not be set in same time.
   */
  private _updateSelectedOption(): void {
    this._selectedOption = this._options.find(option => option.value === this._value);
  }

  /**
   * Apply the change of search string to `SearchSelectOptions` to filter the option.
   * The `y` position should be updated as well because the height of options can be changed.
   */
  private _updateFilteredOptionsAndPosition(filteredOptions: OptionItem<string>[]): void {
    this._optionsOverlayContentsRef?.component.instance.updateOptions(filteredOptions);
    this._optionsOverlayContentsRef?.component.instance.updatePosition();
  }

  /**
   * Emit `searchChange` emitter.
   * The developer needs to change options from the parent component when it is emitted.
   */
  private _emitSearchChange(): void {
    this.searchChange.emit(this._search);
  }
}
