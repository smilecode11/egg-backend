
import { Controller } from 'egg';
import pureMenuList from './datas/pureMenuList';
export interface IndexCondition {
  pageIndex?: number;
  pageSize?: number;
  select?: string | string[];
  populate?: { path?: string, select?: string };
  customSort?: Record<string, any>;
  find?: Record<string, any>;
}

export default class PureController extends Controller {
  // 登录
  async login() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    console.log('_login', username, password);
    ctx.helper.success({
      ctx,
      res: {
        username: 'admin',
        // 一个用户可能有多个角色
        roles: ['admin'],
        accessToken: 'eyJhbGciOiJIUzUxMiJ9.admin',
        refreshToken: 'eyJhbGciOiJIUzUxMiJ9.adminRefresh',
        expires: '2023/10/30 00:00:00',
      },
    });
  }
  //  根据用户角色返回动态路由
  async getAsyncRoutes() {
    const { ctx } = this;
    ctx.helper.success({
      ctx,
      res: pureMenuList,
    });
  }
  //  创建角色
  async createRole() {
    const { ctx } = this;
    try {
      const roleResp = await ctx.service.pureRole.createRole(ctx.request.body);
      // console.log('_createRole', roleResp);
      ctx.helper.success({
        ctx, res: {
          id: roleResp.id,
        },
      });
    } catch (error) {
      ctx.helper.fail({ ctx, errorType: 'pureCreateRoleFail' });
    }
  }

  //  获取角色列表
  async getRoleList() {
    const { ctx } = this;
    const { currentPage: pageIndex, pageSize, name, code, status } = ctx.request.body;
    const listCondition: IndexCondition = {
      select: 'id name code status remark menu createdAt',
      find: {
        is_delete: '0',
        ...(name && { name: { $regex: name, $options: 'i' } }),
        ...(code && { code: { $regex: code, $options: 'i' } }),
        ...(status && { status }),
      },
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    };
    const res = (await ctx.service.pureRole.getRoles(listCondition));
    ctx.helper.success({
      ctx,
      res,
    });
  }

  // 编辑角色状态
  async setRoleStatus() {
    const { ctx } = this;
    const res = await ctx.service.pureRole.setRoleStatus(ctx.request.body);
    ctx.helper.success({ ctx, res });
  }

  // 编辑角色
  async editRole() {
    const { ctx } = this;
    const roleResp = await ctx.service.pureRole.editRole(ctx.request.body) as any;
    ctx.helper.success({
      ctx, res: {
        id: roleResp.id,
      },
    });
  }
}

export const pureErrorMessage = {
  pureInputValidateFail: {
    errno: 301001,
    message: '输入信息验证失败',
  },
  pureAccountExistsFail: {
    errno: 301002,
    message: '用户已存在',
  },
  pureAccountOriginPasswordFail: {
    errno: 301008,
    message: '账号原密码错误',
  },
  pureLoginCheckFail: {
    errno: 301003,
    message: '用户名或密码验证失败',
  },
  pureLoginValidateFail: {
    errno: 301004,
    message: '用户验证失败',
  },
  pureSendVeriCodeFrequentlyFail: {
    errno: 301005,
    message: '请勿频繁获取短信验证码',
  },
  pureSendVeriCodeFail: {
    errno: 301007,
    message: '发送验证码失败',
  },
  pureLoginByCellphoneCheckFail: {
    errno: 301006,
    message: '验证码错误',
  },
  pureCreateRoleFail: {
    errno: 900001,
    message: '角色创建失败',
  },
};
