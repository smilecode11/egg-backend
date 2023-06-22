
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
  /** 创建角色*/
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
  /** 获取角色列表*/
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
  /** 编辑角色状态*/
  async setRoleStatus() {
    const { ctx } = this;
    const res = await ctx.service.pureRole.setRoleStatus(ctx.request.body);
    ctx.helper.success({ ctx, res });
  }
  /** 编辑角色*/
  async editRole() {
    const { ctx } = this;
    const roleResp = await ctx.service.pureRole.editRole(ctx.request.body) as any;
    ctx.helper.success({
      ctx, res: {
        id: roleResp.id,
      },
    });
  }
  /** 删除角色*/
  async deleteRole() {
    const { ctx } = this;
    const roleResp = await ctx.service.pureRole.deleteRole(ctx.request.body) as any;
    ctx.helper.success({
      ctx, res: {
        id: roleResp.id,
      },
    });
  }
  /** 新建菜单*/
  async createMenu() {
    const { ctx } = this;
    const roleResp = await ctx.service.pureMenu.createMenu(ctx.request.body);
    // console.log('_createMenu', roleResp);
    ctx.helper.success({
      ctx, res: {
        id: roleResp.id,
      },
    });
  }
  /** 获取菜单列表*/
  async getMenuList() {
    //
  }
  /** 获取全部菜单(层级)*/
  async getAllMenuWithLevel() {
    const { ctx } = this;
    const { status, title, name } = ctx.query;
    const listCondition: IndexCondition = {
      select: 'id title name type parentMenu routePath status keepAlive redirectRoutePath createdAt icon',
      find: {
        is_delete: '0',
        ...(status && { status }),
        ...(title && { title: { $regex: title, $options: 'i' } }),
        ...(name && { name: { $regex: name, $options: 'i' } }),
      },
    };
    const res = (await ctx.service.pureMenu.getMenus(listCondition));
    // console.log('_allMenu', res.items);
    const tree = getChild(getTop(res.items), res.items);
    // console.log('_allMenu', tree);
    ctx.helper.success({
      ctx,
      res: tree,
    });
  }
  /** 编辑菜单状态*/
  async setMenuStatus() {
    const { ctx } = this;
    const res = await ctx.service.pureMenu.setMenuStatus(ctx.request.body);
    ctx.helper.success({ ctx, res });
  }
  /** 编辑菜单*/
  async editMenuItem() {
    const { ctx } = this;
    const roleResp = await ctx.service.pureMenu.editMenuItem(ctx.request.body) as any;
    ctx.helper.success({
      ctx, res: {
        id: roleResp.id,
      },
    });
  }
  /** 删除菜单*/
  async deleteMenu() {
    const { ctx } = this;
    const roleResp = await ctx.service.pureMenu.deleteMenu(ctx.request.body) as any;
    ctx.helper.success({
      ctx, res: {
        id: roleResp.id,
      },
    });
  }
  /** 新建部门*/
  async createDept() {
    const { ctx } = this;
    const roleResp = await ctx.service.pureDept.createDept(ctx.request.body);
    ctx.helper.success({
      ctx, res: {
        id: roleResp.id,
      },
    });
  }
  /** 获取全部部门(层级)*/
  async getAllDeptWithLevel() {
    const { ctx } = this;
    const { status, name } = ctx.request.body;
    const listCondition: IndexCondition = {
      select: 'id name head headMobile headEmail parentDept status createdAt',
      find: {
        is_delete: '0',
        ...(status && { status }),
        ...(name && { name: { $regex: name, $options: 'i' } }),
      },
    };
    const res = (await ctx.service.pureDept.getDepts(listCondition));
    // console.log('_items', res.items);
    const tree = getChild(getTop(res.items, 'parentDept'), res.items, 'parentDept');
    ctx.helper.success({
      ctx,
      res: tree,
    });
  }
  /** 编辑部门状态*/
  async setDeptStatus() {
    const { ctx } = this;
    const res = await ctx.service.pureDept.setDeptStatus(ctx.request.body);
    ctx.helper.success({ ctx, res });
  }
  /** 编辑部门*/
  async editDeptItem() {
    const { ctx } = this;
    const roleResp = await ctx.service.pureDept.editDeptItem(ctx.request.body) as any;
    ctx.helper.success({
      ctx, res: {
        id: roleResp.id,
      },
    });
  }
  /** 删除部门*/
  async deleteDept() {
    const { ctx } = this;
    const roleResp = await ctx.service.pureDept.deleteDept(ctx.request.body) as any;
    ctx.helper.success({
      ctx, res: {
        id: roleResp.id,
      },
    });
  }
  //  创建账号
  async createAccount() {
    const { ctx } = this;
    try {
      const accountResp = await ctx.service.pureAccount.createAccount(ctx.request.body);
      ctx.helper.success({
        ctx, res: {
          id: accountResp.id,
        },
      });
    } catch (error) {
      ctx.helper.fail({ ctx, errorType: 'pureTempFail' });
    }
  }
  //  获取账号列表
  async getAccountList() {
    const { ctx } = this;
    const { currentPage: pageIndex, pageSize, nickname, account, status, deptId } = ctx.request.body;
    const listCondition: IndexCondition = {
      select: 'id nickname status remark createdAt dept phone account email role pwd -_id',
      find: {
        is_delete: '0',
        ...(nickname && { nickname: { $regex: nickname, $options: 'i' } }),
        ...(account && { account: { $regex: account, $options: 'i' } }),
        ...(status && { status }),
        ...(deptId && { dept: deptId }),
      },
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    };
    const res = (await ctx.service.pureAccount.getAccounts(listCondition));
    ctx.helper.success({ ctx, res });
  }
  //  编辑账号状态
  async setAccountStatus() {
    const { ctx } = this;
    const res = await ctx.service.pureAccount.setAccountStatus(ctx.request.body);
    ctx.helper.success({ ctx, res });
  }
  // 编辑账号
  async editAccount() {
    const { ctx } = this;
    const accountResp = await ctx.service.pureAccount.editAccount(ctx.request.body) as any;
    ctx.helper.success({
      ctx, res: {
        id: accountResp.id,
      },
    });
  }
  // 修改密码
  async editAccountPassword() {
    const { ctx } = this;
    const { user } = ctx.state;
    const { passwordOld, passwordNew } = ctx.request.body;
    // 获取用户对比
    const currUser = await ctx.model.pureAccount.findById(user._id);
    // console.log('_currUser', currUser);
    if (currUser) {
      if (currUser.pwd === passwordOld) {
        const resp = await ctx.model.pureAccount.findOneAndUpdate({ _id: user._id }, { pwd: passwordNew });
        if (resp) ctx.helper.success({ ctx, res: { msg: '密码修改成功' } });
      } else {
        ctx.helper.fail({ ctx, errorType: 'pureAccountOriginPasswordFail' });
      }
    } else {
      ctx.helper.fail({ ctx, errorType: 'vbenLoginCheckFail' });
    }
  }
  //  删除账号
  async deleteAccount() {
    const { ctx } = this;
    const accountResp = await ctx.service.pureAccount.deleteAccount(ctx.request.body) as any;
    ctx.helper.success({
      ctx, res: {
        id: accountResp.id,
      },
    });
  }
  //  账号是否存在
  async isAccountExist() {
    const { ctx } = this;
    const { account } = ctx.request.body;
    const findResp = await ctx.model.pureAccount.findOne({ account });
    console.log('_findRes', findResp);
    if (findResp) {
      ctx.helper.fail({
        ctx, errorType: 'pureAccountExistsFail',
      });
    } else {
      ctx.helper.success({
        ctx, res: {
          message: 'ok',
        },
      });
    }
  }
  /** 获取账号菜单*/
  async getAccountMenuList() {
    const { ctx } = this;
    // 菜单基础数据构建
    const menuList = await ctx.service.pureAccount.getAccountMenuList();
    // 菜单层级构建
    const tree = getChild(getTop(menuList, 'parentMenu'), menuList, 'parentMenu', 'children'); // 获得菜单树
    // 菜单排序
    tree.sort((a, b) => b.meta.orderNo - a.meta.orderNo);
    ctx.helper.success({ ctx, res: tree });
  }
}

/** 获得顶级点*/
function getTop(arry, parentKey = 'parentMenu') {
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

export const pureErrorMessage = {
  pureTempFail: {
    errno: 301099,
    message: '临时失败',
  },
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
