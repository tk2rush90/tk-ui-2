import {AfterViewInit, Directive, ElementRef} from '@angular/core';

/**
 * Set focus to the host element on view init.
 */
@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements AfterViewInit {

  constructor(
    protected elementRef: ElementRef<HTMLElement>,
  ) { }

  ngAfterViewInit(): void {
    this.element.focus();
  }

  /**
   * Get host element.
   */
  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}
