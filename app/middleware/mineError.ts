import { Context } from 'egg';

export default () => {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next();
    } catch (e) {
      const error = e as any;
      console.log('_mineError', error);
      if (error && error.status === 401) {
        return ctx.helper.fail({ ctx, errorType: 'loginValidateFail' });
      }
      throw error;
    }
  };
};
