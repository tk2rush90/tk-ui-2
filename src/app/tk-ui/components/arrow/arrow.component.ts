import {Component, HostBinding, Input} from '@angular/core';

export type ArrowDirection = 'top' | 'right' | 'bottom' | 'left';

/**
 * Create css arrow.
 * Can be used for chat bubble, tooltip, or etc.
 * This code referenced https://cssarrowplease.com/.
 */
@Component({
  selector: 'app-arrow',
  templateUrl: './arrow.component.html',
  styleUrls: ['./arrow.component.scss']
})
export class ArrowComponent {
  /**
   * Arrow border width.
   */
  @Input() borderWidth = 0;

  /**
   * Arrow background color.
   */
  @Input() backgroundColor = '';

  /**
   * Arrow border color.
   */
  @Input() borderColor = '';

  /**
   * Arrow direction.
   * Bind to `direction` attribute to set different styles according to its direction.
   */
  @HostBinding('attr.direction') @Input() direction: ArrowDirection = 'bottom';

  /**
   * Arrow size.
   */
  private _size = 0;

  /**
   * Set arrow size.
   * The size will be reduced by half because the arrow will be generated with double sized.
   * @param size - The arrow size.
   */
  @Input()
  set size(size: number) {
    this._size = size / 2;
  }

  /**
   * Get width of arrow container.
   */
  @HostBinding('style.width')
  get width(): string {
    return `calc(${this.arrowBorderSize} * 2)`;
  }

  /**
   * Get height of arrow container.
   */
  @HostBinding('style.height')
  get height(): string {
    return `calc(${this.arrowBorderSize} * 2)`;
  }

  /**
   * Get arrow size.
   */
  get size(): number {
    return this._size;
  }

  /**
   * Get width style for arrow.
   */
  get arrowSize(): string {
    return `${this.size}px`;
  }

  /**
   * Get calculated width style for arrow border.
   */
  get arrowBorderSize(): string {
    return `${this.size + Math.round(this.borderWidth * Math.sqrt(2))}px`;
  }

  /**
   * Get `backgroundColor` when arrow direction is `'right'`.
   */
  get leftArrowBackground(): string {
    return this.direction === 'right' ? this.backgroundColor : 'transparent';
  }

  /**
   * Get `backgroundColor` when arrow direction is `'left'`.
   */
  get rightArrowBackground(): string {
    return this.direction === 'left' ? this.backgroundColor : 'transparent';
  }

  /**
   * Get `backgroundColor` when arrow direction is `'bottom'`.
   */
  get topArrowBackground(): string {
    return this.direction === 'bottom' ? this.backgroundColor : 'transparent';
  }

  /**
   * Get `backgroundColor` when arrow direction is `'top'`.
   */
  get bottomArrowBackground(): string {
    return this.direction === 'top' ? this.backgroundColor : 'transparent';
  }

  /**
   * Get `borderColor` when arrow direction is `'right'`.
   */
  get leftArrowBorder(): string {
    return this.direction === 'right' ? this.borderColor : 'transparent';
  }

  /**
   * Get `borderColor` when arrow direction is `'left'`.
   */
  get rightArrowBorder(): string {
    return this.direction === 'left' ? this.borderColor : 'transparent';
  }

  /**
   * Get `borderColor` when arrow direction is `'bottom'`.
   */
  get topArrowBorder(): string {
    return this.direction === 'bottom' ? this.borderColor : 'transparent';
  }

  /**
   * Get `borderColor` when arrow direction is `'top'`.
   */
  get bottomArrowBorder(): string {
    return this.direction === 'top' ? this.borderColor : 'transparent';
  }
}
