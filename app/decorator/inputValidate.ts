import { Controller } from '../../typings/app';
import { GlobalErrorTypes } from '../extend/helper';

export default function validateInput(rules: any, errorType: GlobalErrorTypes) {
  return function(prototype, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const _self = this as Controller;
      //  eslint-disable-next-line
      //  @ts-ignore
      const { ctx, app } = _self;
      const errors = app.validator.validate(rules, ctx.request.body);
      if (errors) return ctx.helper.fail({ ctx, errorType, error: errors });
      return originalMethod.apply(this, args);
    };
  };
}
