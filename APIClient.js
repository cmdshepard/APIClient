import APIResponseError from './errors/APIResponseError.js';
import NetworkError from './errors/NetworkError.js';

export const CONTENT_TYPE = {
  JSON: 'application/json',
  FORM_URL_ENCODED: 'application/x-www-form-urlencoded',
};

export default class APIClient {

  static CONTENT_TYPE = CONTENT_TYPE;

  static fetch = fetch;

  constructor({
    host,
    contentType,
    headers,
    payloadSignMethod,
  } = {
    host: '0.0.0.0',
    contentType: CONTENT_TYPE.JSON,
    headers: { accept: CONTENT_TYPE.JSON },
    payloadSignMethod: null,
  }) {
    this.host = host;
    this.contentType = contentType;
    this.headers = new Headers(headers);
    this.payloadSignMethod = payloadSignMethod;
  }

  /**
   * @param path {string}
   * @returns {Promise<Object>}
   */
  get = path => this._request({
    path,
    method: 'GET',
  });

  /**
   * @param path {string}
   * @param body {?object}
   * @returns {Promise<Object>}
   */
  post = (path, body) => this._request({
    path,
    body,
    method: 'POST',
  });

  /**
   * @param path {string}
   * @param body {?object}
   * @returns {Promise<Object>}
   */
  patch = (path, body) => this._request({
    path,
    body,
    method: 'PATCH',
  });

  /**
   * @param path {string}
   * @param body {?object}
   * @returns {Promise<Object>}
   */
  put = (path, body) => this._request({
    path,
    body,
    method: 'PUT',
  });

  /**
   * @param path {string}
   * @param body {?object}
   * @returns {Promise<Object>}
   */
  del = (path, body) => this._request({
    path,
    body,
    method: 'DELETE',
  });

  /**
   * @param method {'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'}
   * @param path {string}
   * @param body {?object}
   * @returns {Promise<object>}
   * @private
   */
  async _request({
    method,
    path,
    body = null,
  }) {
    let response;

    try {
      const url = `${this.host}${path}`;
      let bodyToSend;

      if (body) {
        switch (this.contentType) {
          case CONTENT_TYPE.JSON:
            bodyToSend = JSON.stringify(body);
            break;
          case CONTENT_TYPE.FORM_URL_ENCODED:
            bodyToSend = new URLSearchParams(body).toString();
            break;
        }

        if (typeof this.payloadSignMethod === 'function') {
          bodyToSend = await this.payloadSignMethod(bodyToSend);
        }
      }

      response = await APIClient.fetch(url, {
        method,
        headers: this.headers,
        body : bodyToSend
      });
    } catch (e) {
      console.error(e);
      throw new NetworkError();
    }

    if (!response.ok) {
      const status = `${response.status} ${response.statusText}`;
      throw new APIResponseError(status);
    }

    return response.json();
  }

}
