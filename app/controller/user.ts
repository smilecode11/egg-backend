import { Controller } from 'egg';

//  声明通过邮箱用户创建规则
const userCreateByEmailRules = {
  username: 'email',
  password: { type: 'password', min: 8 },
};

export const userErrorMessage = {
  createUserValidateFail: {
    errno: 101001,
    message: '创建用户验证失败',
  },
  createUserExistsFail: {
    errno: 101002,
    message: '用户已存在, 请直接登录',
  },
};

export default class UserController extends Controller {
  async createByEmail() {
    const { service, ctx, app } = this;
    //  第一种, 直接使用, 验证不通过会直接抛出
    // ctx.validate(userCreateByEmailRules);
    // 第二种, 通过 app.validator.validate 对数据进行验证
    const errors = app.validator.validate(userCreateByEmailRules, ctx.request.body);
    if (errors) {
      return ctx.helper.fail({ ctx, errorType: 'createUserValidateFail', error: errors });
    }
    const user = await service.user.findByUsername(ctx.request.body.username);
    if (user) {
      return ctx.helper.fail({ ctx, errorType: 'createUserExistsFail' });
    }
    const userData = await service.user.createByEmail(ctx.request.body);
    ctx.helper.success({ ctx, res: userData });
  }

  async getUserById() {
    const { ctx, service } = this;
    const userData = await service.user.findById(ctx.params.id);
    ctx.helper.success({ ctx, res: userData });
  }
}
