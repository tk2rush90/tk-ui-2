import {Component, ElementRef, HostBinding, HostListener, Input, Optional, Self, ViewChild} from '@angular/core';
import {CustomFormControl} from '@tk-ui/bases/custom-form-control/custom-form-control.directive';
import {NgControl} from '@angular/forms';
import {OptionItem} from '@tk-ui/models/option-item';
import {AvailableKey, EventUtil} from '@tk-ui/utils/event.util';
import {OverlayContentsRef, OverlayService} from '@tk-ui/components/overlay/overlay.service';
import {
  SelectOptionsComponent,
  SelectOptionsData
} from '@tk-ui/components/select/select-options/select-options.component';
import {OverlayOutletComponent} from '@tk-ui/components/overlay/overlay-outlet/overlay-outlet.component';

/**
 * The alternates Component for `<select>` element.
 */
@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    OverlayService,
  ],
})
export class SelectComponent extends CustomFormControl<string> {
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
  private _optionsOverlayContentsRef: OverlayContentsRef<SelectOptionsComponent, string | undefined> | null = null;

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
    return this._selectedOption?.label || '';
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
        .drawComponent<SelectOptionsComponent, SelectOptionsData, string | undefined>({
          id: this.overlayOutlet.id,
          component: SelectOptionsComponent,
          data: {
            options: this._options,
            value: this._value,
            button: this.buttonRef.nativeElement,
          },
          onClose: res => {
            if (res) {
              this.setValue(res);
            }

            this.markAsTouched();
            this._optionsOverlayContentsRef = null;
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
   * Update the `_selectedOption` by searching option from `_options` with `_value`.
   * This should be called from both `writeValue()` and `set options()` because
   * the `_value` and `_options` may not be set in same time.
   */
  private _updateSelectedOption(): void {
    this._selectedOption = this._options.find(option => option.value === this._value);
  }
}
