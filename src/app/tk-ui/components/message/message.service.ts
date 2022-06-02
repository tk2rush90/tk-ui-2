import {ComponentRef, Injectable, ViewContainerRef} from '@angular/core';
import {ObjectMap} from '@tk-ui/others/types';
import {MessageOutletComponent} from '@tk-ui/components/message/message-outlet/message-outlet.component';
import {MessageComponent, MessageLevel} from '@tk-ui/components/message/message/message.component';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';

/**
 * This service provided in 'root' level.
 * The global `SubscriptionService` is required.
 */
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  /**
   * Map of `ViewContainerRef` of `MessageOutletComponent`.
   */
  private _containerRefs: ObjectMap<ViewContainerRef> = {};

  /**
   * Map of an Array consist of `ComponentRef` of `MessageComponent`.
   */
  private _messageRefs: ObjectMap<ComponentRef<MessageComponent>[]> = {};

  /**
   * The message maximum count.
   */
  private readonly _messageMaxCount = 10;

  /**
   * The message auto close timer in milliseconds.
   */
  private readonly _messageCloseAfter = 3000;

  /**
   * Set this value to `false` to do not stack message up.
   * It is useful when displaying only single message at once.
   */
  private readonly _canStackMessage = true;

  constructor(
    private subscriptionService: SubscriptionService,
  ) {
  }

  registerOutlet(outlet: MessageOutletComponent): void {
    this._containerRefs[outlet.id] = outlet.viewContainerRef;
    this._messageRefs[outlet.id] = [];
  }

  /**
   * Create info level message.
   * @param data - The data to display.
   */
  info(...data: any[]): void {
    this._createMessage(MessageLevel.info, ...data);
  }

  /**
   * Create error level message.
   * @param data - The data to display.
   */
  error(...data: any[]): void {
    this._createMessage(MessageLevel.error, ...data);
  }

  /**
   * Create success level message.
   * @param data - The data to display.
   */
  success(...data: any[]): void {
    this._createMessage(MessageLevel.success, ...data);
  }

  /**
   * Create the message for specific level with data.
   * @param level - The message level.
   * @param data - The message data.
   */
  private _createMessage(level: MessageLevel, ...data: any[]): void {
    Object.keys(this._containerRefs).forEach(id => {
      this._removeExceededMessageRefs(id);

      const viewContainerRef = this._containerRefs[id];
      const messageRef = viewContainerRef.createComponent(MessageComponent);

      messageRef.instance.data = data;
      messageRef.instance.level = level;
      messageRef.instance.outletId = id;
      messageRef.instance.closeAfter = this._messageCloseAfter;
      messageRef.instance.canStackMessage = this._canStackMessage;
      messageRef.changeDetectorRef.detectChanges();

      this._subscribeMessageClose(messageRef);
      this._messageRefs[id].push(messageRef);
    });
  }

  /**
   * Subscribe the `close` emitter of message.
   * @param messageRef - The `ComponentRef` of `MessageComponent`.
   */
  private _subscribeMessageClose(messageRef: ComponentRef<MessageComponent>): void {
    const sub = messageRef.instance
      .close
      .subscribe(() => {
        messageRef.destroy();

        this._removeMessageRefSubscription(messageRef);
        this._removeClosedMessageRef(messageRef);
      });

    this.subscriptionService.store(`_subscribeMessageClose${messageRef.instance.id}`, sub);
  }

  /**
   * Remove the subscription for `messageRef`.
   * @param messageRef - The `ComponentRef` of `MessageComponent`.
   */
  private _removeMessageRefSubscription(messageRef: ComponentRef<MessageComponent>): void {
    this.subscriptionService.unSubscribe(`_subscribeMessageClose${messageRef.instance.id}`);
  }

  /**
   * Remove the closed `messageRef`
   * @param messageRef - The `ComponentRef` of `MessageComponent`.
   */
  private _removeClosedMessageRef(messageRef: ComponentRef<MessageComponent>): void {
    const outletId = messageRef.instance.outletId;

    this._messageRefs[outletId] = this._messageRefs[outletId].filter(_messageRef => _messageRef !== messageRef);
  }

  /**
   * Remove the messages that exceed the `_messageMaxCount`.
   * @param id - The outlet id to remove.
   */
  private _removeExceededMessageRefs(id: string): void {
    while (this._messageRefs[id].length >= this._messageMaxCount) {
      this._messageRefs[id].shift()?.destroy();
    }
  }
}
