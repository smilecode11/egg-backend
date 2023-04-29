import { Controller } from 'egg';
import * as menuList from './datas/vbenMenuList.js';
export default class VbenController extends Controller {
  // 登录
  async login() {
    const { ctx } = this;
    ctx.helper.success({
      ctx,
      res: {
        token: 'xxxxxxvben-tokenxxxxx',
        message: '登录成功',
      },
    });
  }
  //  登出
  async logout() {
    const { ctx } = this;
    ctx.helper.success({
      ctx,
      res: {
        message: '登出成功',
      },
    });
  }
  //  获取用户信息
  async getUserInfo() {
    const { ctx } = this;
    ctx.helper.success({
      ctx,
      res: {
        roles: [],
        // 用户id
        userId: '0',
        // 用户名
        username: 'smiling',
        // 真实名字
        realName: '吴鹏',
        // 头像
        avatar: '',
        // 介绍
        desc: '测试用户',
        message: 'userinfo ok',
      },
    });
  }

  // 获取用户权限列表
  async getMenuList() {
    const { ctx } = this;
    ctx.helper.success({
      ctx,
      res: menuList,
    });
  }

  //  获取权限码
  async getPermCode() {
    const { ctx } = this;
    ctx.helper.success({
      ctx,
      res: {
        perm_code: [ '10001', '10002' ],
        message: 'userinfo ok',
      },
    });
  }

  //  获取验证码
  async getSms() {
    const { ctx } = this;
    ctx.helper.success({
      ctx,
      res: {
        smsCode: '1234',
        message: '验证码发送成功, 请注意查收!',
      },
    });
    // ctx.helper.fail({ ctx, errorType: 'sendVeriCodeFrequentlyFail' });
  }

  //  重置密码
  async resetPassword() {
    const { ctx } = this;
    ctx.helper.success({
      ctx,
      res: {
        account: ctx.request.body.account,
        message: '密码重置成功!',
      },
    });
    // ctx.helper.fail({ ctx, errorType: 'sendVeriCodeFrequentlyFail' });
  }
}
