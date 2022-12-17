import { Controller } from 'egg';
import * as jwt from 'jsonwebtoken';

//  声明通过邮箱用户创建规则
const userCreateByEmailRules = {
  username: 'email',
  password: { type: 'password', min: 8 },
};

const veriCodeRules = {
  phoneNumber: { type: 'string', format: /^1[356789][0-9]{9}$/ },
};

const userLoginByCellphoneRules = {
  phoneNumber: { type: 'string', format: /^1[356789][0-9]{9}$/ },
  veriCode: { type: 'string', length: 4 },
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
  loginValidateFail: {
    errno: 101004,
    message: '用户验证失败',
  },
  sendVeriCodeFrequentlyFail: {
    errno: 101005,
    message: '请勿频繁获取短信验证码',
  },
  sendVeriCodeFail: {
    errno: 101007,
    message: '发送验证码失败',
  },
  loginByCellphoneCheckFail: {
    errno: 101006,
    message: '验证码错误',
  },
};

export default class UserController extends Controller {
  /** 验证输入数据是否正确*/
  validateUserInput(rules) {
    const { ctx, app } = this;
    //  通过 app.validator.validate 对数据进行验证
    const errors = app.validator.validate(rules, ctx.request.body);
    ctx.logger.warn(errors);
    return errors;
  }

  /** 通过邮箱创建用户*/
  async createByEmail() {
    const { service, ctx } = this;
    const errors = this.validateUserInput(userCreateByEmailRules);
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
    const { ctx, service, app } = this;
    const errors = this.validateUserInput(userCreateByEmailRules);
    if (errors) return ctx.helper.fail({ ctx, errorType: 'inputValidateFail', error: errors });
    const { username, password } = ctx.request.body;
    const user = await service.user.findByUsername(username);
    if (!user) return ctx.helper.fail({ ctx, errorType: 'loginCheckFail' });
    const verifyPwd = await ctx.compare(password, user.password as string);
    if (!verifyPwd) return ctx.helper.fail({ ctx, errorType: 'loginCheckFail' });
    //  1. 登录成功, 生成 token 返回
    const token = jwt.sign({ username }, app.config.mineJwt.secret, { expiresIn: 60 * 60 });

    //  egg-jwt 在 app 上添加了 jwt 对象
    // const token = app.jwt.sign({ username }, app.config.jwt.secret, { expiresIn: 60 * 60 });
    ctx.helper.success({ ctx, res: { token }, msg: '登录成功' });
  }

  /** 获取验证码*/
  async getVeriCode() {
    const { ctx, app } = this;
    //  1. 验证输入手机你格式
    const errors = this.validateUserInput(veriCodeRules);
    if (errors) return ctx.helper.fail({ ctx, errorType: 'inputValidateFail' });
    //  2. 判断验证码是否已存在 redis 中, 存储格式 key: phoneVeriCode-18958849752 -> value: 四位随机数
    const { phoneNumber } = ctx.request.body;
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    //  2.1 存在返回频繁获取
    if (preVeriCode) return ctx.helper.fail({ ctx, errorType: 'sendVeriCodeFrequentlyFail' });
    //  2.2 不存在, 生成验证码, 并返回验证码
    const veriCode = Math.floor((Math.random() * 9000 + 1000));
    //  ***** 生产环境, 调用阿里云短信服务发送验证码 *******
    if (app.config.env === 'prod') {
      const resp = await ctx.service.user.sendSMS(phoneNumber, veriCode as unknown as string);
      if (resp.body.code !== 'ok') {
        return ctx.helper.fail({ ctx, errorType: 'sendVeriCodeFail' });
      }
    }
    //  2.2.1 存储到 redis, 过期时间设置为 60s 并返回验证码
    await app.redis.set(`phoneVeriCode-${phoneNumber}`, veriCode, 'ex', 60);
    //  **** 本地开发, 直接返回 veriCode
    ctx.helper.success({ ctx, res: app.config.env === 'prod' ? null : { veriCode }, msg: '验证码发送成功' });
  }

  /** 用户登录 - 手机验证码*/
  async loginByCellphone() {
    const { ctx, app } = this;
    //  1. 检查输入格式是否正确
    const errors = this.validateUserInput(userLoginByCellphoneRules);
    if (errors) return ctx.helper.fail({ ctx, errorType: 'inputValidateFail' });
    //  2. 检查验证码是否正确
    const { phoneNumber, veriCode } = ctx.request.body;
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    console.log('_loginByCellphone preVeriCode', preVeriCode, veriCode);
    if (preVeriCode !== veriCode) return ctx.helper.fail({ ctx, errorType: 'loginByCellphoneCheckFail' });
    //  3. 检查用户(手机号)是否注册, 返回 token
    const token = await this.service.user.loginByCellphone(phoneNumber);
    ctx.helper.success({ ctx, res: { token } });
  }

  /** 获取 token, 存储位置 - header Authorization, 存储格式 - Bearer xxxx */
  getTokenValue() {
    const { ctx } = this;
    const { authorization } = ctx.header;
    if (!ctx.header || !authorization) return false;
    if (typeof authorization === 'string') {
      const parts = authorization.trim().split(' ');
      if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
          return credentials;
        }
      } else {
        return false;
      }
    }
  }

  async current() {
    const { ctx, service } = this;
    //  2. 获取头部存储的 token
    // const token = this.getTokenValue();
    // if (!token) return ctx.helper.fail({ ctx, errorType: 'loginValidateFail' });
    // try {
    //   //  3. 验证 token
    //   const decoded = jwt.verify(token, app.config.jwt.secret);
    //   ctx.helper.success({ ctx, res: decoded });
    // } catch (error) {
    //   ctx.helper.fail({ ctx, errorType: 'loginValidateFail' });
    // }
    //  编写的 mineJwt 中间件把 解密处理来的信息保存到了 ctx.state 中, 这里我们直接取
    const { user } = ctx.state;
    const userData = await service.user.findByUsername(user.username);
    if (!userData) return ctx.helper.fail({ ctx, errorType: 'loginCheckFail' });
    ctx.helper.success({ ctx, res: userData });
  }

  async current2() {
    const { ctx, service } = this;
    //  egg-jwt 存储数据也是在 ctx.state 上, 和我们自己写的 mineJwt 一样
    const { user } = ctx.state;
    const userData = await service.user.findByUsername(user.username);
    if (!userData) return ctx.helper.fail({ ctx, errorType: 'loginCheckFail' });
    ctx.helper.success({ ctx, res: userData });
  }

  async getUserById() {
    const { ctx, service } = this;
    const userData = await service.user.findById(ctx.params.id);
    ctx.helper.success({ ctx, res: userData });
  }
}
