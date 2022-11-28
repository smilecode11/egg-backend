import { Application, Context, EggAppConfig } from 'egg';
import { appendFileSync } from 'fs';

export default (options: EggAppConfig['mineLogger'], app: Application) => {
  app;
  return async (ctx: Context, next: () => Promise<any>) => {
    const startTime = Date.now();
    const requestTime = new Date();
    await next();
    const ms = Date.now() - startTime;
    const logTime = `${requestTime} -- ${ctx.method} -- ${ctx.url} -- ${ms}ms`;
    console.log('_options', options, '_method', ctx.method);
    console.log(options.allowMethods.includes(ctx.method));
    if (options.allowMethods.includes(ctx.method)) {
      appendFileSync('./log.txt', logTime + '\n');
    }
  };
};
