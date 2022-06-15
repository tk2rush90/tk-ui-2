import {Component, HostBinding, HostListener} from '@angular/core';

/**
 * The component which will be displayed as a modal needs to extend this `Modal` component.
 * Do not try to render this component.
 */
@Component({
  selector: 'app-modal',
  template: '',
})
export class Modal {
  /**
   * Bind base class for modal.
   */
  @HostBinding('class.tk-modal') class = true;

  /**
   * Stop propagation of `click` event because the `ModalGroupComponent`
   * is listening `click` event to close the modal.
   * @param event - The `MouseEvent`.
   */
  @HostListener('click', ['$event'])
  onHostClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
