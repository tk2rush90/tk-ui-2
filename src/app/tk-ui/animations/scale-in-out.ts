import {animate, state, style, transition, trigger} from '@angular/animations';

/**
 * The animation trigger name for `scale-in-out`.
 */
export const SCALE_IN_OUT_ANIMATION_NAME = 'scale-in-out';

/**
 * The animation state enum for `scale-in-out`.
 */
export enum ScaleInOutState {
  void = 'void',
  show = 'show',
}

/**
 * The `scale-in-out` animation.
 */
export const scaleInOut = trigger(SCALE_IN_OUT_ANIMATION_NAME, [
  state(ScaleInOutState.void, style({
    transform: 'scale(0)',
  })),
  state(ScaleInOutState.show, style({
    transform: 'scale(1)',
  })),
  transition(`${ScaleInOutState.void} <=> ${ScaleInOutState.show}`, animate('.05s ease-out')),
]);
