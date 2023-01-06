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
      //  针对文件上传返回 400 情况特殊处理
      if ((/\/uploads/g).test(ctx.request.url) && error.status === 400) {
        return ctx.helper.fail({ ctx, errorType: 'imageUploadWithTypeFail', error: error.message });
      }
      throw error;
    }
  };
};
