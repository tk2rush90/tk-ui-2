import {Component, EventEmitter, HostBinding, HostListener, Input, Output, ViewChild} from '@angular/core';
import {RippleDirective} from '@tk-ui/components/ripple/ripple.directive';

/**
 * The radio button component.
 */
@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent<T> {
  /**
   * The radio value.
   */
  @Input() value!: T;

  /**
   * Radio click emitter.
   */
  @Output() radioClick = new EventEmitter<void>();

  /**
   * Radio selected state.
   */
  @HostBinding('class.tk-selected') selected = false;

  /**
   * Radio disabled state.
   * This is updated by `RadioGroupComponent`.
   */
  @HostBinding('class.tk-disabled') disabled = false;

  /**
   * Radio focused state.
   * This is updated by `RadioGroupComponent`.
   */
  @HostBinding('class.tk-focused') focused = false;

  /**
   * Select ripple directive.
   */
  @ViewChild(RippleDirective) ripple!: RippleDirective;

  /**
   * Listen host `click` event to emit `radioClick` emitter.
   */
  @HostListener('click')
  onHostClick(): void {
    this.radioClick.emit();
  }

  /**
   * Listen host `pointerdown` event to show ripple.
   */
  @HostListener('pointerdown', ['$event'])
  onHostPointerdown(event: PointerEvent): void{
    this.ripple.addRipple(event);
  }

  /**
   * Make ripple destroyable.
   */
  @HostListener('pointerup')
  onHostPointerUp(): void {
    this.ripple.setRippleDestroyable();
  }

  /**
   * Make ripple destroyable.
   */
  @HostListener('pointerout')
  onHostPointerOut(): void {
    this.ripple.setRippleDestroyable();
  }
}
