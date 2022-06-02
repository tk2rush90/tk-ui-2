import {animate, state, style, transition, trigger} from '@angular/animations';

/**
 * The animation trigger name for `show-down`.
 */
export const SHOW_DOWN_ANIMATION_NAME = 'show-down';

/**
 * The animation state enum for `show-down`.
 */
export enum ShowDownState {
  void = 'void',
  show = 'show',
}

/**
 * The `show-down` animation.
 */
export const showDownAnimation = trigger(SHOW_DOWN_ANIMATION_NAME, [
  state(ShowDownState.void, style({
    opacity: 0,
    transform: 'translateY(-10px)',
  })),
  state(ShowDownState.show, style({
    opacity: 1,
    transform: 'translateY(0)',
  })),
  transition(`${ShowDownState.void} <=> ${ShowDownState.show}`, animate('.15s')),
]);
