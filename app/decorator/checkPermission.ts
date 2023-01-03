import { Controller } from 'egg';
import { GlobalErrorTypes } from '../extend/helper';


export default function checkPermission(modelName: string, errorType: GlobalErrorTypes, userKey = 'user') {
  return function(prototype, key: string, descriptor: PropertyDescriptor) {
    const orgiginMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const _self = this as Controller;
      //  eslint-disable-next-line
      //  @ts-ignore
      const { ctx } = _self;
      const { id } = ctx.params;
      const userId = ctx.state.user._id;
      const certianRecord = await ctx.model[modelName].findOne({ id });
      if (!certianRecord || certianRecord[userKey].toString() !== userId) return ctx.helper.fail({ ctx, errorType });
      await orgiginMethod.apply(this, args);
    };
  };
}
