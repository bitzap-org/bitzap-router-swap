import original, { AfterResponseHook } from 'ky';

const defaultErrorKey = 'api.errors.unexpected';

const codeMessageMap: Record<number, string> = {
  502002: 'api.errors.unmintRateLimit',
  502003: 'api.errors.burnRateLimit',
  502004: 'api.errors.invalidUnmintAmount',
};

export type CommonErrorResponse = {
  code: number;
  msg: string;
};

export class APIError extends Error {
  readonly i18nKey: string = defaultErrorKey;

  constructor(public message: string, public code: number, public response: Response) {
    super(message);
    this.name = 'APIError';
    if (code in codeMessageMap) {
      this.i18nKey = codeMessageMap[code];
    }
  }
}

export const getAPIErrorMessageKey = (error: Error, action?: string): string => {
  let key = defaultErrorKey;
  if (error instanceof APIError) {
    key = error.i18nKey;
  }
  if (error.message && error.message.includes('User rejected the request')) {
    key = action ? `bridge.errors.${action}` : 'bridge.errors.userRejected';
  }
  if (
    error.message &&
    (error.message.includes('pegin utxo is not available') ||
      error.message.includes('dust utxo is already used'))
  ) {
    key = 'api.errors.invalidUnmintAmount';
  }
  return key;
};

const throwErrorHook: AfterResponseHook = async (_request, _options, response) => {
  if (response.status >= 400) {
    let code = -1;
    let msg = 'Internal Server Error';
    try {
      const body: CommonErrorResponse = await response.json();
      code = body.code;
      msg = body.msg;
    } catch (e) {
      // ignore
    }
    throw new APIError(msg, code, response);
  }
  return response;
};

const afterResponseHooks = [throwErrorHook];

export const ky = original.extend({
  hooks: {
    afterResponse: afterResponseHooks,
  },
});
