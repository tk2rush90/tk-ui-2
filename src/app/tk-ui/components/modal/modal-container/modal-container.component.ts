import {Component, ElementRef, HostBinding, HostListener, Inject, ViewChild, ViewContainerRef} from '@angular/core';
import {FADE_IN_OUT_ANIMATION_NAME, fadeInOut, FadeInOutState} from '@tk-ui/animations/fade-in-out';
import {MODAL_REF, ModalRef} from '@tk-ui/components/modal/modal.service';

@Component({
  selector: 'app-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.scss'],
  animations: [
    fadeInOut,
  ],
})
export class ModalContainerComponent {
  /**
   * Bind `fade-in-out` animation.
   */
  @HostBinding(`@${FADE_IN_OUT_ANIMATION_NAME}`) fadeInOut = FadeInOutState.show;

  /**
   * `ViewContainerRef` for `ng-container`.
   */
  @ViewChild('container', {read: ViewContainerRef}) viewContainerRef!: ViewContainerRef;

  constructor(
    @Inject(MODAL_REF) private _modalRef: ModalRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
  ) {
  }

  /**
   * Get host element.
   */
  get element(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  /**
   * Detect the modal closeable event.
   */
  @HostListener('click', ['$event'])
  onHostClick(event: MouseEvent): void {
    if (event.target === this.element) {
      // Close the modal when not preventing closing.
      if (!this._modalRef.preventClosing) {
        this._modalRef.close();
      }
    }
  }
}
