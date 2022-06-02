import {Component, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';
import {FADE_IN_OUT_ANIMATION_NAME, fadeInOut, FadeInOutState} from '@tk-ui/animations/fade-in-out';
import {AnimationEvent} from '@angular/animations';

/**
 * The component which will be displayed as a modal needs to extend this `Modal` component.
 * Do not try to render this component.
 */
@Component({
  selector: 'app-modal',
  template: '',
  animations: [
    fadeInOut,
  ],
})
export class Modal {
  /**
   * Removed emitter.
   */
  @Output() removed = new EventEmitter<void>();

  /**
   * Bind `fade-in-out` animation.
   */
  @HostBinding(`@${FADE_IN_OUT_ANIMATION_NAME}`) fadeInOut = FadeInOutState.show;

  /**
   * Bind base class for modal.
   */
  @HostBinding('class.tk-modal') class = true;

  /**
   * Listen animation done event.
   * @param event - The `AnimationEvent`.
   */
  @HostListener(`@${FADE_IN_OUT_ANIMATION_NAME}.done`, ['$event'])
  onFadeInOutDone(event: AnimationEvent): void {
    if (
      event.fromState === FadeInOutState.show
      && event.toState === FadeInOutState.void
    ) {
      this.removed.emit();
    }
  }

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
