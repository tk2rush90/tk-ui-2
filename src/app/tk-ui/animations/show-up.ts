import {animate, state, style, transition, trigger} from '@angular/animations';

/**
 * The animation trigger name for `show-up`.
 */
export const SHOW_UP_ANIMATION_NAME = 'show-up';

/**
 * The animation state enum for `show-up`.
 */
export enum ShowUpState {
  void = 'void',
  show = 'show',
}

/**
 * The `show-up` animation.
 */
export const showUpAnimation = trigger(SHOW_UP_ANIMATION_NAME, [
  state(ShowUpState.void, style({
    opacity: 0,
    transform: 'translateY(10px)',
  })),
  state(ShowUpState.show, style({
    opacity: 1,
    transform: 'translateY(0)',
  })),
  transition(`${ShowUpState.void} <=> ${ShowUpState.show}`, animate('.15s')),
]);
