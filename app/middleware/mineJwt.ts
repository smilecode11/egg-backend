import { Context, EggAppConfig } from 'egg';
import { verify } from 'jsonwebtoken';

/** 从 header 中获取 token*/
const getTokenValue = (ctx: Context) => {
  const { authorization } = ctx.header;
  if (!ctx.header || !authorization) return false;
  if (typeof authorization === 'string') {
    const parts = authorization.trim().split(' ');
    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];
      if (/^Bearer/i.test(scheme)) {
        return credentials;
      }
    } else {
      return false;
    }
  }
};

/** jwt 中间件*/
export default (options: EggAppConfig['mineJwt']) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    const token = getTokenValue(ctx);
    if (!token) return ctx.helper.fail({ ctx, errorType: 'loginValidateFail' });
    //  判断 secret 是否存在
    const { secret } = options;
    if (!secret) throw new Error('JWT Secret not provieded');
    try {
      //  验证 token, 保存状态 ctx.state.user
      const decoded = verify(token, options.secret);
      ctx.state.user = decoded;
      await next();
    } catch (error) {
      return ctx.helper.fail({ ctx, errorType: 'loginValidateFail' });
    }
  };
};
