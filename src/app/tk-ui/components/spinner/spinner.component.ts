import {Component, HostBinding, Input} from '@angular/core';
import {MathUtil} from '@tk-ui/utils/math.util';
import {animate, AnimationEvent, state, style, transition, trigger} from '@angular/animations';
import {FADE_IN_OUT_ANIMATION_NAME, fadeInOut, FadeInOutState} from '@tk-ui/animations/fade-in-out';

/**
 * The spinner component.
 */
@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  animations: [
    trigger('spin', [
      state('void', style({
        transform: 'rotate(0)',
      })),
      state('rotate1', style({
        transform: 'rotate(180deg)',
      })),
      state('rotate2', style({
        transform: 'rotate(720deg)',
      })),
      transition('void => rotate1', animate('{{duration1}}ms'), {
        params: {
          duration1: 0,
        },
      }),
      transition('rotate1 => rotate2', animate('{{duration2}}ms'), {
        params: {
          duration2: 0,
        },
      }),
      transition('rotate2 => void', animate('0s')),
    ]),
    trigger('dash', [
      state('void', style({
        'stroke-dashoffset': '0',
      })),
      state('fill', style({
        'stroke-dashoffset': '{{dasharray}}',
      }), {
        params: {
          dasharray: 0,
        },
      }),
      state('disappear', style({
        'stroke-dashoffset': '{{dasharray}}',
      }), {
        params: {
          dasharray: 0,
        },
      }),
      transition('void => fill', animate('{{duration}}ms'), {
        params: {
          duration: 0,
        },
      }),
      transition('fill => disappear', animate('{{duration}}ms'), {
        params: {
          duration: 0,
        },
      }),
      transition('disappear => void', animate('0s')),
    ]),
    fadeInOut,
  ]
})
export class SpinnerComponent {
  /**
   * Spinner size.
   */
  @Input() size = 24;

  /**
   * Duration in milliseconds.
   */
  @Input() duration = 500;

  /**
   * Spinner stroke width.
   */
  @Input() strokeWidth = 3;

  /**
   * Spinner stroke color.
   */
  @Input() color = 'rgba(0, 0, 0, .2)';

  /**
   * Bind `fade-in-out` animation.
   */
  @HostBinding(`@${FADE_IN_OUT_ANIMATION_NAME}`) fadeInOut = FadeInOutState.show;

  /**
   * State of `spin` animation.
   */
  spin = {
    value: 'void',
    params: {
      duration1: this.duration / 5,
      duration2: this.duration,
    },
  };

  /**
   * State of `dash` animation.
   */
  dash = {
    value: 'void',
    params: {
      dasharray: this.dashArray,
      duration: this.duration,
    },
  };

  /**
   * Get `viewBox` of spinner svg.
   */
  get viewBox(): string {
    return `0 0 ${this.size} ${this.size}`;
  }

  /**
   * Get center of spinner.
   */
  get center(): number {
    return this.size / 2;
  }

  /**
   * Get radius of spinner.
   */
  get radius(): number {
    return this.center - this.strokeWidth / 2;
  }

  /**
   * Get `stroke-dasharray` of spinner.
   */
  get dashArray(): number {
    return MathUtil.getCircleRoundLength(this.radius);
  }

  /**
   * Move to next state when `spin` animation done.
   * @param event - The `AnimationEvent.
   */
  onSpinDone(event: AnimationEvent): void {
    switch (event.toState) {
      case 'void': {
        this.spin = {
          value: 'rotate1',
          params: {
            duration1: this.duration / 5,
            duration2: this.duration,
          },
        };

        break;
      }

      case 'rotate1': {
        this.spin = {
          value: 'rotate2',
          params: {
            duration1: this.duration / 5,
            duration2: this.duration,
          },
        };

        break;
      }

      case 'rotate2': {
        this.spin = {
          value: 'void',
          params: {
            duration1: this.duration / 5,
            duration2: this.duration,
          },
        };

        break;
      }
    }
  }

  /**
   * Move to next state when `dash` animation done.
   * @param event - The `AnimationEvent.
   */
  onDashDone(event: AnimationEvent): void {
    switch (event.toState) {
      case 'void': {
        this.dash = {
          value: 'fill',
          params: {
            dasharray: this.dashArray,
            duration: this.duration,
          },
        };

        break;
      }

      case 'fill': {
        this.dash = {
          value: 'disappear',
          params: {
            dasharray: this.dashArray * 2,
            duration: this.duration,
          },
        };

        break;
      }

      case 'disappear': {
        this.dash = {
          value: 'void',
          params: {
            dasharray: this.dashArray,
            duration: this.duration,
          },
        };

        break;
      }
    }
  }
}
