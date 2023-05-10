import { Controller } from 'egg';
import menuList from './datas/vbenMenuList';
// import allMenuList from './datas/vbenMenuAllList';

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

  // 获取用户菜单
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

  //  获取所有菜单
  async getAllMenuList() {
    const { ctx } = this;
    const { status, menuName } = ctx.query;
    const listCondition: IndexCondition = {
      select: 'id menuName type parentMenu orderNo icon routePath component permission status isExt keepalive show menuEnName redirectRoutePath createdAt',
      find: {
        is_delete: '0',
        ...(status && { status }),
        ...(menuName && { menuName: { $regex: menuName, $options: 'i' } }),
      },
    };
    const res = (await ctx.service.vbenMenu.getMenus(listCondition));
    // console.log('_allMenu', res.items);
    // TIP: 获得菜单 tree
    const tree = getChild(getTop(res.items), res.items);
    // console.log('_allMenu', tree);
    ctx.helper.success({
      ctx,
      res: tree,
    });
  }

  //  新增菜单
  async addMenuItem() {
    const { ctx } = this;
    try {
      const roleResp = await ctx.service.vbenMenu.createMenu(ctx.request.body);
      ctx.helper.success({
        ctx, res: {
          id: roleResp.id,
        },
      });
    } catch (error) {
      console.log('_addMenuItem', error);
      // ctx.helper.fail({ ctx, errorType: 'loginByGiteeCheckFail' });
    }
  }

  //  编辑菜单
  async editMenu() {
    const { ctx } = this;
    const roleResp = await ctx.service.vbenMenu.editMenu(ctx.request.body) as any;
    ctx.helper.success({
      ctx, res: {
        id: roleResp.id,
      },
    });
  }

  //  删除菜单
  async deleteMenu() {
    const { ctx } = this;
    const roleResp = await ctx.service.vbenMenu.deleteMenu(ctx.request.body) as any;
    ctx.helper.success({
      ctx, res: {
        id: roleResp.id,
      },
    });
  }
}


/** 获得顶级点*/
function getTop(arry) {
  return arry.filter(item => item.id === item.parentMenu || item.parentMenu === 0);
}
/** 获得子节点*/
function getChild(pArry, arry) {
  pArry.forEach(idt => {
    idt.children = arry.filter(item => idt.id === item.parentMenu);
    if ((idt.children).length > 0) {
      getChild(idt.children, arry);
    }
  });
  return pArry;
}
// getChild(getTop(adreeJson), adreeJson);
