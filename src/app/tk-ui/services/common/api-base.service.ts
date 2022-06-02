import {ValidationUtil} from '@tk-ui/utils/validation.util';

export interface UnrefinedParams {
  [key: string]: any;
}

export class ApiBaseService {
  /**
   * The host url.
   */
  private readonly _host: string;

  constructor(path = '', host = '') {
    this._host = host;
    this._host += path;
  }

  /**
   * Return the api endpoint by prefixing `_host`.
   * @param path - The endpoint path string.
   */
  protected endpoint(path = ''): string {
    return this._host + path;
  }

  /**
   * Create http params from object type params.
   * @param params - The object type http params.
   */
  protected _getHttpParams(params: UnrefinedParams): { [k: string]: string } {
    const refined: { [k: string]: string } = {};

    Object.keys(params || {}).forEach(key => {
      if (ValidationUtil.isDefined(params[key])) {
        refined[key] = params[key] + '';
      }
    });

    return refined;
  }
}
