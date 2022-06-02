import {animate, state, style, transition, trigger} from '@angular/animations';

/**
 * The animation trigger name for `fade-in-out`.
 */
export const FADE_IN_OUT_ANIMATION_NAME = 'fade-in-out';

/**
 * The animation state enum for `fade-in-out`.
 */
export enum FadeInOutState {
  void = 'void',
  show = 'show',
}

/**
 * The `fade-in-out` animation.
 */
export const fadeInOut = trigger(FADE_IN_OUT_ANIMATION_NAME, [
  state(FadeInOutState.void, style({
    opacity: 0,
  })),
  state(FadeInOutState.show, style({
    opacity: 1,
  })),
  transition(`${FadeInOutState.void} <=> ${FadeInOutState.show}`, animate('.15s')),
]);
