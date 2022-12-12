import { Controller } from 'egg';

//  声明通过邮箱用户创建规则
const userCreateByEmailRules = {
  username: 'email',
  password: { type: 'password', min: 8 },
};

export const userErrorMessage = {
  inputValidateFail: {
    errno: 101001,
    message: '输入信息验证失败',
  },
  createUserExistsFail: {
    errno: 101002,
    message: '用户已存在, 请直接登录',
  },
  loginCheckFail: {
    errno: 101003,
    message: '用户名或密码验证失败',
  },
};

export default class UserController extends Controller {
  /** 验证输入数据是否正确*/
  validateUserInput() {
    const { ctx, app } = this;
    //  通过 app.validator.validate 对数据进行验证
    const errors = app.validator.validate(userCreateByEmailRules, ctx.request.body);
    ctx.logger.warn(errors);
    return errors;
  }

  /** 通过邮箱创建用户*/
  async createByEmail() {
    const { service, ctx } = this;
    const errors = this.validateUserInput();
    if (errors) {
      return ctx.helper.fail({ ctx, errorType: 'inputValidateFail', error: errors });
    }
    const user = await service.user.findByUsername(ctx.request.body.username);
    if (user) {
      return ctx.helper.fail({ ctx, errorType: 'createUserExistsFail' });
    }
    const userData = await service.user.createByEmail(ctx.request.body);
    ctx.helper.success({ ctx, res: userData });
  }

  /** 用户登录 - 邮箱*/
  async loginByEmail() {
    const { ctx, service } = this;
    const errors = this.validateUserInput();
    if (errors) return ctx.helper.fail({ ctx, errorType: 'inputValidateFail', error: errors });
    const { username, password } = ctx.request.body;
    const user = await service.user.findByUsername(username);
    if (!user) return ctx.helper.fail({ ctx, errorType: 'loginCheckFail' });
    const verifyPwd = await ctx.compare(password, user.password);
    if (!verifyPwd) return ctx.helper.fail({ ctx, errorType: 'loginCheckFail' });
    //  设置 cookie, encrypt 属性表示对 cookie 进行加密
    // ctx.cookies.set('username', user.username, { encrypt: true });
    //  设置 session
    ctx.session.username = user.username;
    ctx.helper.success({ ctx, res: user, msg: '登录成功' });
  }

  async current() {
    const { ctx } = this;
    //  加密的 cookie 进行访问, 也必须添加 encrypt 属性
    // const username = ctx.cookies.get('username', { encrypt: true });
    const { username } = ctx.session;
    if (!username) return ctx.helper.fail({ ctx, errorType: 'loginCheckFail' });
    ctx.helper.success({ ctx, res: { username } });
  }

  async getUserById() {
    const { ctx, service } = this;
    const userData = await service.user.findById(ctx.params.id);
    ctx.helper.success({ ctx, res: userData });
  }
}
