import {ObjectMap} from '@tk-ui/others/types';

/**
 * Create style string with style map.
 * @param style - The style map.
 */
function createStyles(style: ObjectMap<string>): string {
  return Object.keys(style).map(attribute => {
    return `${attribute}: ${style[attribute]}`;
  }).join('; ');
}

/**
 * Logger util to handle logging of browser.
 */
export class LoggerUtil {
  /**
   * Production state.
   */
  static production = false;

  /**
   * Show info level log.
   * @param data - The log data.
   */
  static info(...data: any[]): void {
    console.info('%c[INFO]', createStyles({color: 'lightgreen'}), ...data);
  }

  /**
   * Show debug level log.
   * @param data - The log data.
   */
  static debug(...data: any[]): void {
    if (!this.production) {
      console.debug('%c[DEBUG]', createStyles({color: 'lightblue'}), ...data);
    }
  }

  /**
   * Show warn level log.
   * @param data - The log data.
   */
  static warn(...data: any[]): void {
    if (!this.production) {
      console.warn('%c[WARNING]', createStyles({color: 'yellow'}), ...data);
    }
  }

  /**
   * Show error level log.
   * @param data - The log data.
   */
  static error(...data: any[]): void {
    console.error('%c[ERROR]', createStyles({color: 'red'}), ...data);
  }

  /**
   * Create `Logger` for specific context.
   * @param context - The context of `Logger`.
   */
  static createLogger(context: Object): Logger {
    return new Logger(context);
  }
}

export class Logger {
  /**
   * The name of Logger context.
   */
  private readonly _contextName: string;

  constructor(context: Object) {
    this._contextName = context.constructor.name;
  }

  /**
   * Show info level log.
   * @param data - The log data.
   */
  info(...data: any[]): void {
    LoggerUtil.info(`[${this._contextName}]`, ...data);
  }

  /**
   * Show debug level log.
   * @param data - The log data.
   */
  debug(...data: any[]): void {
    LoggerUtil.debug(`[${this._contextName}]`, ...data);
  }

  /**
   * Show warn level log.
   * @param data - The log data.
   */
  warn(...data: any[]): void {
    LoggerUtil.warn(`[${this._contextName}]`, ...data);
  }

  /**
   * Show error level log.
   * @param data - The log data.
   */
  error(...data: any[]): void {
    LoggerUtil.error(`[${this._contextName}]`, ...data);
  }
}
