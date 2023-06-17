import { Context } from 'egg';
import { userErrorMessage } from '../controller/user';
import { workErrorMessages } from '../controller/work';
import { utilsErrorMessages } from '../controller/utils';
import { vbenErrorMessage } from '../controller/vben';
import { pureErrorMessage } from '../controller/pure';

export type GlobalErrorTypes = keyof (typeof userErrorMessage & typeof workErrorMessages & typeof utilsErrorMessages & typeof vbenErrorMessage & typeof pureErrorMessage &{});
export const globalErrorMessages = { ...userErrorMessage, ...workErrorMessages, ...utilsErrorMessages, ...vbenErrorMessage, ...pureErrorMessage };

interface RespType {
  ctx: Context;
  res?: any;
  msg?: string;
}

interface ErrorRespType {
  ctx: Context;
  // errorType: keyof (typeof userErrorMessage),
  errorType: GlobalErrorTypes,
  error?: any
}

export default {
  success({ ctx, res, msg }: RespType) {
    ctx.body = {
      errno: 0,
      data: res ? res : null,
      message: msg ? msg : '请求成功',
    };
    ctx.status = 200;
  },

  fail({ ctx, error, errorType }: ErrorRespType) {
    const { errno, message } = globalErrorMessages[errorType];
    ctx.body = {
      errno,
      message,
      ...(error && { error }),
    };
    ctx.status = 200;
  },
};
