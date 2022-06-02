import {AfterViewInit, Component, ElementRef, HostBinding, Input, Renderer2} from '@angular/core';
import {PlatformService} from '@tk-ui/services/universal/platform.service';
import {IconDefinitions} from '@tk-ui/components/icon/icon-defs';

/**
 * Draw svg icon.
 * The rendered `<svg>` element is fit to host element.
 * So host element size need to be set by css from the parent component.
 */
@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements AfterViewInit {
  /**
   * The name of icon.
   */
  private _name: keyof typeof IconDefinitions | undefined;

  /**
   * Svg element from `icon-defs.ts`.
   */
  private _icon: SVGElement | undefined;

  constructor(
    private renderer: Renderer2,
    private platformService: PlatformService,
    private elementRef: ElementRef<HTMLElement>,
  ) {
  }

  /**
   * Set icon name.
   * @param name - The icon name.
   */
  @Input()
  set name(name: keyof typeof IconDefinitions | undefined) {
    this._name = name;
    this._setIcon();
  }

  /**
   * Bind name to attribute.
   */
  @HostBinding('attr.tk-name')
  get nameAttribute(): keyof typeof IconDefinitions | undefined {
    return this._name;
  }

  ngAfterViewInit(): void {
    this._setIcon();
  }

  /**
   * Set icon with name.
   */
  private _setIcon(): void {
    // Since `DOMParser` is part of browser, setting icon only works for browser.
    if (this.platformService.isBrowser) {
      this._removeExistingIcon();
      this._parseSvgIcon();
      this._appendSvgToView();
    }
  }

  /**
   * Remove existing icon from element.
   */
  private _removeExistingIcon(): void {
    if (this._icon && this.elementRef?.nativeElement) {
      this.renderer.removeChild(this.elementRef.nativeElement, this._icon);
    }
  }

  /**
   * Parse svg icon to element with `DOMParser`.
   */
  private _parseSvgIcon(): void {
    if (this._name) {
      const domParser = new DOMParser();
      const html = domParser.parseFromString(IconDefinitions[this._name], 'text/html');

      this._icon = html.querySelector('svg') as SVGElement;
    }
  }

  /**
   * Append svg icon to view.
   */
  private _appendSvgToView(): void {
    if (this._icon && this.elementRef?.nativeElement) {
      this.renderer.appendChild(this.elementRef.nativeElement, this._icon);
    }
  }
}
