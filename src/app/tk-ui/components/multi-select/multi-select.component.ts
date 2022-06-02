import {Component, ElementRef, HostBinding, HostListener, Input, Optional, Self, ViewChild} from '@angular/core';
import {OverlayOutletComponent} from '@tk-ui/components/overlay/overlay-outlet/overlay-outlet.component';
import {OptionItem} from '@tk-ui/models/option-item';
import {OverlayContentsRef, OverlayService} from '@tk-ui/components/overlay/overlay.service';
import {NgControl} from '@angular/forms';
import {AvailableKey, EventUtil} from '@tk-ui/utils/event.util';
import {CustomFormControl} from '@tk-ui/bases/custom-form-control/custom-form-control.directive';
import {
  MultiSelectOptionsComponent,
  MultiSelectOptionsData
} from '@tk-ui/components/multi-select/multi-select-options/multi-select-options.component';
import {ObjectMap} from '@tk-ui/others/types';
import {ObjectUtil} from '@tk-ui/utils/object.util';

/**
 * The select component that can allow multiple selection.
 */
@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  providers: [
    OverlayService,
  ],
})
export class MultiSelectComponent extends CustomFormControl<string[]> {
  /**
   * Placeholder.
   */
  @Input() placeholder = '';

  /**
   * Refer to OverlayOutlet.
   */
  @ViewChild(OverlayOutletComponent) overlayOutlet!: OverlayOutletComponent;

  /**
   * Refer to the select toggle button.
   */
  @ViewChild('button', {read: ElementRef}) buttonRef!: ElementRef<HTMLElement>;

  /**
   * Focused state.
   */
  focused = false;

  /**
   * Disabled state.
   */
  disabled = false;

  /**
   * Selected options.
   */
  private _selectedOptions: OptionItem<string>[] = [];

  /**
   * Label for input element.
   */
  private _label = '';

  /**
   * The selected value.
   */
  private _value: string[] = [];

  /**
   * Selected values map.
   * The key is value of each option.
   */
  private _valuesMap: ObjectMap<boolean> = {};

  /**
   * Available options.
   */
  private _options: OptionItem<string>[] = [];

  /**
   * The overlay contents for options.
   */
  private _optionsOverlayContentsRef: OverlayContentsRef<MultiSelectOptionsComponent, void> | null = null;

  constructor(
    @Self() @Optional() public override ngControl: NgControl,
    private elementRef: ElementRef<HTMLElement>,
    private overlayService: OverlayService,
  ) {
    super(ngControl);
  }

  /**
   * Set options for select.
   * @param options - Options.
   */
  @Input()
  set options(options: OptionItem<string>[]) {
    this._options = options;
    this._updateSelectedOption();
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
    return this._label;
  }

  /**
   * Get current value.
   */
  get value(): string[] {
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
  override writeValue(value: string[]): void {
    this._value = value || [];
    this._valuesMap = ObjectUtil.getUniqueKeys(this._value);
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
   * Listen host `keydown` event to make user can toggle options.
   * @param event - The `KeyboardEvent`.
   */
  @HostListener('keydown', ['$event'])
  onHostKeydown(event: KeyboardEvent): void {
    if (
      !this.opened
      && (
        // Allow `Enter`, `Space`, `ArrowDown`, `ArrowUp` to open options.
        EventUtil.isKey(event, AvailableKey.Enter)
        || EventUtil.isKey(event, AvailableKey.Space)
        || EventUtil.isKey(event, AvailableKey.ArrowDown)
        || EventUtil.isKey(event, AvailableKey.ArrowUp)
      )
    ) {
      EventUtil.disable(event);

      this.openOptions();
    }
  }

  /**
   * Set `focused` state on focused.
   */
  @HostListener('focus')
  onHostFocus(): void {
    this.focused = true;
  }

  /**
   * Unset `focused` state and mark component as touched on blur.
   */
  @HostListener('blur')
  onHostBlur(): void {
    this.focused = false;
    this.markAsTouched();
    this._closeOptions();
  }

  /**
   * Set focus to host element.
   */
  focusToHost(): void {
    this.element.focus();
  }

  /**
   * Open options.
   */
  openOptions(): void {
    if (!this.opened && !this.disabled) {
      this._optionsOverlayContentsRef = this.overlayService
        .drawComponent<MultiSelectOptionsComponent, MultiSelectOptionsData, void>({
          id: this.overlayOutlet.id,
          component: MultiSelectOptionsComponent,
          data: {
            options: this._options,
            value: this._value,
            button: this.buttonRef.nativeElement,
            onChange: value => {
              this.setValue(value);
            },
          },
          onClose: () => {
            this._optionsOverlayContentsRef = null;
            this.markAsTouched();
          },
        });
    }
  }

  /**
   * Close the options if opened.
   */
  private _closeOptions(): void {
    if (this.opened) {
      this.overlayService.clearOverlay(this.overlayOutlet.id);
    }
  }

  /**
   * Update the `_selectedOptions` by searching option from `_options` with `_valueMap`.
   * This should be called from both `writeValue()` and `set options()` because
   * the `_value` and `_options` may not be set in same time.
   * Also, update the `_label` with `_selectedOptions`.
   */
  private _updateSelectedOption(): void {
    this._selectedOptions = this._options.filter(option => this._valuesMap[option.value]);
    this._label = this._selectedOptions.map(option => option.label).join(', ');
  }
}
