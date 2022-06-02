import {AfterViewInit, Component, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';
import {animate, AnimationEvent, state, style, transition, trigger} from '@angular/animations';
import {RandomUtil} from '@tk-ui/utils/random.util';

/**
 * Animation state for ripple.
 */
export enum RippleAnimationState {
  void = 'void',
  ripple = 'ripple',
  disappear = 'disappear',
}

/**
 * The ripple component.
 * It creates ripple to `RippleDirective` when pointerdown triggered from `RippleDirective`.
 */
@Component({
  selector: 'app-ripple',
  templateUrl: './ripple.component.html',
  styleUrls: ['./ripple.component.scss'],
  animations: [
    trigger('ripple', [
      state(RippleAnimationState.void, style({
        opacity: .3,
        transform: 'scale(0)',
      })),
      state(RippleAnimationState.ripple, style({
        opacity: .1,
        transform: 'scale(2)',
      })),
      state(RippleAnimationState.disappear, style({
        opacity: 0,
        transform: 'scale(2)',
      })),
      transition(`${RippleAnimationState.void} => ${RippleAnimationState.ripple}`, animate(300)),
      transition(`${RippleAnimationState.ripple} => ${RippleAnimationState.disappear}`, animate(120)),
    ]),
  ]
})
export class RippleComponent implements AfterViewInit {
  /**
   * Emit when component need to be destroyed.
   */
  @Output() destroy: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Bind ripple animation.
   */
  @HostBinding('@ripple') ripple = RippleAnimationState.void;

  /**
   * Random ripple id.
   */
  id = RandomUtil.key();

  /**
   * Set the size of ripple.
   */
  size = 0;

  /**
   * Set top position.
   */
  y = 0;

  /**
   * Set left position.
   */
  x = 0;

  /**
   * The state of destroyable.
   */
  private _canDestroy = false;

  /**
   * The ripple animation ended state.
   */
  private _rippleEnd = false;

  constructor() {
  }

  /**
   * Bind size as width.
   */
  @HostBinding('style.width')
  get width(): string {
    return `${this.size}px`;
  }

  /**
   * Bind size as height.
   */
  @HostBinding('style.height')
  get height(): string {
    return `${this.size}px`;
  }

  /**
   * Get and bind top style.
   */
  @HostBinding('style.top')
  get top(): string {
    return `${this.y}px`;
  }

  /**
   * Get and bind left style.
   */
  @HostBinding('style.left')
  get left(): string {
    return `${this.x}px`;
  }

  /**
   * Get and bind top style.
   */
  @HostBinding('style.margin-top')
  get marginTop(): string {
    return `${-(this.size / 2)}px`;
  }

  /**
   * Get and bind left style.
   */
  @HostBinding('style.margin-left')
  get marginLeft(): string {
    return `${-(this.size / 2)}px`;
  }

  ngAfterViewInit(): void {
    this.ripple = RippleAnimationState.ripple;
  }

  /**
   * Listen ripple animation done event.
   * @param event - Animation event.
   */
  @HostListener('@ripple.done', ['$event'])
  onRippleDone(event: AnimationEvent): void {
    switch (event.toState) {
      case 'ripple': {
        this._rippleEnd = true;
        this._checkDestroyable();
        break;
      }

      case 'disappear': {
        this.destroy.emit();
        break;
      }
    }
  }

  /**
   * Set the ripple destroyable.
   */
  setDestroyable(): void {
    this._canDestroy = true;
    this._checkDestroyable();
  }

  /**
   * Check destroyable state and set animation state.
   */
  private _checkDestroyable(): void {
    if (this._rippleEnd && this._canDestroy) {
      this.ripple = RippleAnimationState.disappear;
    }
  }
}
