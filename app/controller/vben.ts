import { Controller } from 'egg';
import * as menuList from './datas/vbenMenuList';
// console.log('_menuList', menuList);


export interface IndexCondition {
  pageIndex?: number;
  pageSize?: number;
  select?: string | string[];
  // populate?: { path?: string, select?: string };
  customSort?: Record<string, any>;
  find?: Record<string, any>;
}
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
        perm_code: ['10001', '10002'],
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


  //  创建角色
  async createRole() {
    const { ctx } = this;
    try {
      const roleResp = await ctx.service.vbenRole.createRole(ctx.request.body);
      // console.log('_createRole', roleResp);
      ctx.helper.success({
        ctx, res: {
          id: roleResp.id,
        },
      });
    } catch (error) {
      ctx.helper.fail({ ctx, errorType: 'loginByGiteeCheckFail' });
    }
  }

  //  获取角色列表
  async getRoles() {
    const { ctx } = this;
    const { page: pageIndex, pageSize, roleName, status } = ctx.query;
    const listCondition: IndexCondition = {
      select: 'id roleName roleValue orderNo status remark createdAt',
      find: {
        is_delete: '0',
        ...(roleName && { roleName: { $regex: roleName, $options: 'i' } }),
        ...(status && { status }),
      },
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    };
    const res = (await ctx.service.vbenRole.getRoles(listCondition));
    ctx.helper.success({ ctx, res });
  }

  //  编辑角色状态
  async setRoleStatus() {
    const { ctx } = this;
    const res = await ctx.service.vbenRole.setRoleStatus(ctx.request.body);
    ctx.helper.success({ ctx, res });
  }

  // 编辑角色
  async editRole() {
    const { ctx } = this;
    const roleResp = await ctx.service.vbenRole.editRole(ctx.request.body) as any;
    ctx.helper.success({
      ctx, res: {
        id: roleResp.id,
      },
    });
  }

  //  删除角色
  async deleteRole() {
    const { ctx } = this;
    const roleResp = await ctx.service.vbenRole.deleteRole(ctx.request.body) as any;
    ctx.helper.success({
      ctx, res: {
        id: roleResp.id,
      },
    });
  }

  //  获取角色详情
  async getRoleDetail() {
    // const { ctx } = this;
    //
  }
}
