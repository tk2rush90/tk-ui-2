import {Component, HostBinding} from '@angular/core';
import {FADE_IN_OUT_ANIMATION_NAME, fadeInOut, FadeInOutState} from '@tk-ui/animations/fade-in-out';

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
   * Bind `fade-in-out` animation.
   */
  @HostBinding(`@${FADE_IN_OUT_ANIMATION_NAME}`) fadeInOut = FadeInOutState.show;
}
