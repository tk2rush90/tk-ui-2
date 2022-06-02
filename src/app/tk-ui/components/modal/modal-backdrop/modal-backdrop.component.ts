import {Component, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';
import {FADE_IN_OUT_ANIMATION_NAME, fadeInOut, FadeInOutState} from '@tk-ui/animations/fade-in-out';
import {AnimationEvent} from '@angular/animations';

/**
 * The `ModalBackdropComponent`.
 */
@Component({
  selector: 'app-modal-backdrop',
  templateUrl: './modal-backdrop.component.html',
  styleUrls: ['./modal-backdrop.component.scss'],
  animations: [
    fadeInOut,
  ],
})
export class ModalBackdropComponent {
  /**
   * Removed emitter.
   */
  @Output() removed = new EventEmitter<void>();

  /**
   * Bind `fade-in-out` animation.
   */
  @HostBinding(`@${FADE_IN_OUT_ANIMATION_NAME}`) fadeInOut = FadeInOutState.show;

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
}
