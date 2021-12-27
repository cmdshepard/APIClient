import BaseAPIClient from './BaseAPIClient';
import getPlatform, { PLATFORM } from './utils/getPlatform';

export default class APIClient extends BaseAPIClient {
  constructor({
    host,
    contentType,
    headers,
    payloadSignMethod,
  } = {
    host: '0.0.0.0',
    contentType: BaseAPIClient.CONTENT_TYPE.JSON,
    headers: { accept: BaseAPIClient.CONTENT_TYPE.JSON },
    payloadSignMethod: null,
  }) {
    super({
      host,
      contentType,
      headers,
      payloadSignMethod,
      fetch: getPlatform() === PLATFORM.NODE ? require('node-fetch') : fetch,
    });
  }
}
