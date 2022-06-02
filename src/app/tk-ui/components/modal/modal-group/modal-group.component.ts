import {Component, ElementRef, HostBinding, HostListener, ViewChild, ViewContainerRef} from '@angular/core';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {ModalService} from '@tk-ui/components/modal/modal.service';
import {AvailableKey, EventUtil} from '@tk-ui/utils/event.util';
import {AutoFocusDirective} from '@tk-ui/components/auto-focus/auto-focus.directive';

/**
 * The ModalGroup renders ModalBackdrop and Modal.
 * It extends `AutoFocusDirective` to prevent user clicking modal opening button multiple times with keyboard.
 * The `AutoFocusDirective` moves focus to this component.
 */
@Component({
  selector: 'app-modal-group',
  templateUrl: './modal-group.component.html',
  styleUrls: ['./modal-group.component.scss']
})
export class ModalGroupComponent extends AutoFocusDirective {
  /**
   * `ViewContainerRef` for `ng-container`.
   */
  @ViewChild('container', {read: ViewContainerRef}) viewContainerRef!: ViewContainerRef;

  /**
   * Set `tabindex` attribute.
   */
  @HostBinding('attr.tabindex') tabindex = 0;

  /**
   * Use random key for id.
   */
  id = RandomUtil.key();

  /**
   * Prevent closing state.
   * If it's `true`, user can't close the modal with `Escape` button.
   */
  preventClosing = false;

  constructor(
    protected override elementRef: ElementRef<HTMLElement>,
    private modalService: ModalService,
  ) {
    super(elementRef);
  }

  /**
   * Listen keyboard event to close modal with `Escape`.
   * @param event - The `KeyboardEvent`.
   */
  @HostListener('keydown', ['$event'])
  onHostKeydown(event: KeyboardEvent): void {
    if (!this.preventClosing && EventUtil.isKey(event, AvailableKey.Escape)) {
      EventUtil.disable(event);

      this.modalService.closeLatest();
    }
  }

  /**
   * Prevent `blur` from this component.
   */
  @HostListener('blur')
  onHostBlur(): void {
    this.element.focus();
  }

  /**
   * Listen click event to close the modal.
   * @param event - The `MouseEvent`.
   */
  @HostListener('click', ['$event'])
  onHostClick(event: MouseEvent): void {
    if (!this.preventClosing) {
      EventUtil.disable(event);

      this.modalService.closeLatest();
    }
  }
}
