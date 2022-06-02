import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  OnDestroy,
  Output,
  Renderer2
} from '@angular/core';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {SHOW_UP_ANIMATION_NAME, showUpAnimation, ShowUpState} from '@tk-ui/animations/show-up';

/**
 * Enum for message level.
 */
export enum MessageLevel {
  info = 0,
  error = 1,
  success = 2,
}

/**
 * The `MessageComponent`.
 */
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  animations: [
    showUpAnimation,
  ],
})
export class MessageComponent implements AfterViewInit, OnDestroy {
  /**
   * Close emitter.
   */
  @Output() close = new EventEmitter<void>();

  /**
   * Bind animation.
   */
  @HostBinding(`@${SHOW_UP_ANIMATION_NAME}`) showUp = ShowUpState.show;

  /**
   * Bind stackable class.
   * When this value is `false`, messages will be overlapped.
   * The `false` value is useful to display a single message at once.
   */
  @HostBinding('class.tk-message-stackable') canStackMessage!: boolean;

  /**
   * The message unique id.
   */
  id = RandomUtil.key();

  /**
   * The outlet id.
   */
  outletId!: string;

  /**
   * Message level.
   */
  level = MessageLevel.info;

  /**
   * The data.
   */
  data: any[] = [];

  /**
   * Milliseconds to wait auto closing.
   */
  closeAfter!: number;

  /**
   * Timeout timer.
   */
  private _timer: any;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef<HTMLElement>,
  ) {
  }

  /**
   * Bind info level class.
   */
  @HostBinding('class.tk-message-info')
  get info(): boolean {
    return this.level === MessageLevel.info;
  }

  /**
   * Bind error level class.
   */
  @HostBinding('class.tk-message-error')
  get error(): boolean {
    return this.level === MessageLevel.error;
  }

  /**
   * Bind success level class.
   */
  @HostBinding('class.tk-message-success')
  get success(): boolean {
    return this.level === MessageLevel.success;
  }

  /**
   * Get host element.
   */
  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    this._renderData();

    // Start the auto closing timer.
    this._timer = setTimeout(() => this.close.emit(), this.closeAfter);
  }

  ngOnDestroy(): void {
    clearTimeout(this._timer);
  }

  /**
   * Listen `click` event to emit `close` emitter.
   */
  @HostListener('click')
  onHostClick(): void {
    clearTimeout(this._timer);

    this.close.emit();
  }

  /**
   * Render the message data to host element.
   */
  private _renderData(): void {
    this.data.forEach(data => {
      const p = this.renderer.createElement('p');
      const text = this.renderer.createText(data);

      this.renderer.appendChild(p, text);
      this.renderer.appendChild(this.element, p);
    });
  }
}
