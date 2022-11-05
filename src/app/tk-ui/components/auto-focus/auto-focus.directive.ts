import {AfterViewInit, ChangeDetectorRef, Directive, ElementRef} from '@angular/core';

/**
 * Set focus to the host element on view init.
 */
@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements AfterViewInit {

  constructor(
    protected elementRef: ElementRef<HTMLElement>,
    protected changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngAfterViewInit(): void {
    this.element.focus();
    this.changeDetectorRef.detectChanges(); // To suppress error.
  }

  /**
   * Get host element.
   */
  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}
