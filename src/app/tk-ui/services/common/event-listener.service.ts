import {Injectable, OnDestroy} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {LoggerUtil} from '@tk-ui/utils/logger.util';

const {
  production,
} = environment;

export interface RegisteredEvent {
  /**
   * The event target.
   */
  target: EventTarget;

  /**
   * The event type.
   */
  type: keyof WindowEventMap;

  /**
   * The event handler.
   */
  handler: EventHandler;

  /**
   * The event options.
   */
  options?: boolean | AddEventListenerOptions;
}

export type EventHandler = (event: any) => void;

/**
 * Handle event listeners those need to be removed when component destroy.
 * Call `addEvent()` method to register event to manage.
 * Then, if the component is destroyed, it will call.
 */
@Injectable()
export class EventListenerService implements OnDestroy {
  /**
   * Registered events to be removed on destroy.
   */
  private _registeredEvents: RegisteredEvent[] = [];

  /**
   * Logger.
   */
  private _logger = LoggerUtil.createLogger(this);

  ngOnDestroy(): void {
    this._removeAllRegisteredEvents();
  }

  /**
   * Add event to target.
   * @param target - Event target.
   * @param type - Event type.
   * @param handler - Event handler.
   * @param options - Event options.
   */
  addEvent(target: EventTarget, type: keyof WindowEventMap, handler: EventHandler, options?: boolean | AddEventListenerOptions): void {
    // Remove existing event.
    this.removeEvent(target, type, handler, true);

    // Add new event.
    target.addEventListener(type, handler, options);

    this._logger.debug(`Event is added`, {target, type, handler, options});

    // Register event.
    this._registerEvent({
      target,
      type,
      handler,
      options,
    });
  }

  /**
   * Remove event from the target.
   * @param target - Event target.
   * @param type - Event type.
   * @param handler - Event handler.
   * @param ignoreWarning - State of ignoring warning.
   */
  removeEvent(target: EventTarget, type: keyof WindowEventMap, handler: EventHandler, ignoreWarning = false): void {
    const registeredEvent = this._getRegisteredEvent(target, type, handler);

    if (registeredEvent) {
      const {target, type, handler, options} = registeredEvent;

      this._removeEventListener(target, type, handler, options);
      this._unregisterEvent(registeredEvent);
    } else {
      if (!ignoreWarning) {
        this._logger.warn(`Trying to remove event which isn't registered in EventListenerService. This action is ignored.`, {
          target,
          type,
          handler,
        });
      }
    }
  }

  /**
   * Register event
   * @param registeredEvent - Event to register.
   */
  private _registerEvent(registeredEvent: RegisteredEvent): void {
    this._registeredEvents.push(registeredEvent);
  }

  /**
   * Unregister event
   * @param registeredEvent - Event to unregister.
   */
  private _unregisterEvent(registeredEvent?: RegisteredEvent): void {
    this._registeredEvents = this._registeredEvents.filter(item => item !== registeredEvent);
  }

  /**
   * Find and return registered event.
   * It only checks target, type, and handler.
   * @param target - Event target.
   * @param type - Event type.
   * @param handler - Event handler.
   */
  private _getRegisteredEvent(target: EventTarget, type: keyof WindowEventMap, handler: EventHandler): RegisteredEvent | undefined {
    return this._registeredEvents.find(item => {
      return item.target === target
        && item.type === type
        && item.handler === handler;
    });
  }

  /**
   * Remove all registered events.
   */
  private _removeAllRegisteredEvents(): void {
    this._registeredEvents.forEach(({target, type, handler, options}) => {
      this._removeEventListener(target, type, handler, options);
    });

    this._registeredEvents = [];
  }

  /**
   * Remove the event from the target.
   * @param target - The `EventTarget.`
   * @param type - The event type.
   * @param handler - The event handler.
   * @param options - The event options.
   */
  private _removeEventListener(target: EventTarget, type: keyof WindowEventMap, handler: EventHandler, options?: boolean | AddEventListenerOptions): void {
    target.removeEventListener(type, handler, options);

    if (!production) {
      this._logger.debug(`Event is removed`, {target, type, handler, options});
    }
  }
}
