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
      select: 'id roleName roleValue orderNo status remark createdAt menu',
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
    const tree = getChild(getTop(res.items), res.items); // TIP: 获得菜单 tree
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


  //  创建部门
  async createDept() {
    const { ctx } = this;
    try {
      const deptResp = await ctx.service.vbenDept.createDept(ctx.request.body);
      // console.log('_createDept', deptResp);
      ctx.helper.success({
        ctx, res: {
          id: deptResp.id,
        },
      });
    } catch (error) {
      ctx.helper.fail({ ctx, errorType: 'loginByGiteeCheckFail' });
    }
  }

  //  获取部门列表
  async getDepts() {
    const { ctx } = this;
    const { page: pageIndex, pageSize, deptName, status } = ctx.query;
    const listCondition: IndexCondition = {
      select: 'id deptName parentDept orderNo status remark createdAt',
      find: {
        is_delete: '0',
        ...(deptName && { deptName: { $regex: deptName, $options: 'i' } }),
        ...(status && { status }),
      },
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    };
    const res = (await ctx.service.vbenDept.getDepts(listCondition));
    ctx.helper.success({ ctx, res });
  }

  //  获取所有部门
  async getAllDepts() {
    const { ctx } = this;
    const { deptName, status } = ctx.query;
    const listCondition: IndexCondition = {
      select: 'id deptName parentDept orderNo status remark createdAt',
      find: {
        is_delete: '0',
        ...(deptName && { deptName: { $regex: deptName, $options: 'i' } }),
        ...(status && { status }),
      },
    };
    const res = (await ctx.service.vbenDept.getAllDepts(listCondition));
    // console.log('_all depts', res.items);
    const tree = getChild(getTop(res.items, 'parentDept', 'children'), res.items, 'parentDept', 'children'); // TIP: 获得部门 tree
    ctx.helper.success({ ctx, res: tree });
  }

  //  编辑部门状态
  async setDeptStatus() {
    const { ctx } = this;
    const res = await ctx.service.vbenDept.setDeptStatus(ctx.request.body);
    ctx.helper.success({ ctx, res });
  }

  // 编辑部门
  async editDept() {
    const { ctx } = this;
    const deptResp = await ctx.service.vbenDept.editDept(ctx.request.body) as any;
    ctx.helper.success({
      ctx, res: {
        id: deptResp.id,
      },
    });
  }

  //  删除部门
  async deleteDept() {
    const { ctx } = this;
    const deptResp = await ctx.service.vbenDept.deleteDept(ctx.request.body) as any;
    ctx.helper.success({
      ctx, res: {
        id: deptResp.id,
      },
    });
  }

  //  获取部门详情
  async getDeptDetail() {
    // const { ctx } = this;
    //
  }

}


/** 获得顶级点*/
function getTop(arry, parentKey = 'parentMenu', childrenKey = 'children') {
  return arry.filter(item => item.id === item[parentKey] || item[parentKey] === 0);
}
/** 获得子节点*/
function getChild(pArry, arry, parentKey = 'parentMenu', childrenKey = 'children') {
  pArry.forEach(idt => {
    idt[childrenKey] = arry.filter(item => idt.id === item[parentKey]);
    if ((idt[childrenKey]).length > 0) {
      getChild(idt[childrenKey], arry, parentKey, childrenKey);
    }
  });
  return pArry;
}
// getChild(getTop(adreeJson), adreeJson);
