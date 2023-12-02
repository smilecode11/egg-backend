import { Controller } from 'egg';
// import menuList from './datas/vbenMenuList';
import menuList2 from './datas/vbenMenuList2';
// import allMenuList from './datas/vbenMenuAllList';

export const vbenErrorMessage = {
  vbenInputValidateFail: {
    errno: 301001,
    message: '输入信息验证失败',
  },
  vbenAccountExistsFail: {
    errno: 301002,
    message: '用户已存在',
  },
  vbenAccountOriginPasswordFail: {
    errno: 301008,
    message: '账号原密码错误',
  },
  vbenLoginCheckFail: {
    errno: 301003,
    message: '用户名或密码验证失败',
  },
  vbenLoginValidateFail: {
    errno: 301004,
    message: '用户验证失败',
  },
  vbenSendVeriCodeFrequentlyFail: {
    errno: 301005,
    message: '请勿频繁获取短信验证码',
  },
  vbenSendVeriCodeFail: {
    errno: 301007,
    message: '发送验证码失败',
  },
  vbenLoginByCellphoneCheckFail: {
    errno: 301006,
    message: '验证码错误',
  },
};

export interface IndexCondition {
  pageIndex?: number;
  pageSize?: number;
  select?: string | string[];
  populate?: { path?: string, select?: string };
  customSort?: Record<string, any>;
  find?: Record<string, any>;
}
export default class VbenController extends Controller {
  // 登录
  async login() {
    const { ctx } = this;
    const { username: account, password } = ctx.request.body;
    const token = await ctx.service.vbenAccount.loginByAccount({ account, password });
    // console.log('_controller login token', token);
    if (token) {
      ctx.helper.success({
        ctx,
        res: {
          token,
        },
        msg: '登录成功',
      });
    } else {
      ctx.helper.fail({
        ctx,
        errorType: 'vbenLoginCheckFail',
      });
    }
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
  //  获取用户信息
  async getUserInfo() {
    const { ctx } = this;
    // 获取用户信息
    const infoResp = await ctx.service.vbenAccount.getAccountInfo();
    ctx.helper.success({
      ctx,
      res: {
        ...infoResp,
        roles: [],
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

  /** 获取账号菜单*/
  async getAccountMenuList() {
    const { ctx } = this;
    // 菜单基础数据构建
    const menuList = await ctx.service.vbenAccount.getAccountMenuList();
    // 菜单层级构建
    const tree = getChild(getTop(menuList, 'parentMenu', 'children'), menuList, 'parentMenu', 'children'); // 获得菜单树
    // 菜单排序
    tree.sort((a, b) => b.meta.orderNo - a.meta.orderNo);
    // console.log('_ getAccountMenuList resp', tree);

    console.log('_menuList2', menuList2);
    // const tree = menuList2;
    ctx.helper.success({ ctx, res: tree });
  }

  /** 获取菜单列表*/
  async getMenuListByPage() {
    const { ctx } = this;
    const { page: pageIndex, pageSize, menuName, status } = ctx.query;
    const listCondition: IndexCondition = {
      select: 'id menuName icon status remark createdAt updatedAt show keepalive component orderNo -_id',
      find: {
        is_delete: '0',
        ...(menuName && { menuName: { $regex: menuName, $options: 'i' } }),
        ...(status && { status }),
      },
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    };
    const menu = await ctx.service.vbenAccount.getAccountMenuListByPage(listCondition);
    ctx.helper.success({ ctx, res: menu });
  }

  // 获取用户菜单
  async getMenuList() {
    const { ctx } = this;

    ctx.helper.success({
      ctx,
      res: menuList2,
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

  async getAllRole() {
    const { ctx } = this;
    const listCondition: IndexCondition = {
      select: 'id roleName roleValue orderNo status remark createdAt menu',
      find: {
        is_delete: '0',
      },
    };
    const res = (await ctx.service.vbenRole.getAllRoles(listCondition));
    ctx.helper.success({ ctx, res: res.items });
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


  //  创建账号
  async createAccount() {
    const { ctx } = this;
    try {

      const user = await ctx.service.vbenAccount.findByAccount(ctx.request.body.account);
      if (user) {
        return ctx.helper.fail({ ctx, errorType: 'createUserExistsFail' });
      }

      const accountResp = await ctx.service.vbenAccount.createAccount(ctx.request.body);
      ctx.helper.success({
        ctx, res: {
          id: accountResp.id,
        },
      });
    } catch (error) {
      ctx.helper.fail({ ctx, errorType: 'loginByGiteeCheckFail' });
    }
  }

  //  获取账号列表
  async getAccountList() {
    const { ctx } = this;
    const { page: pageIndex, pageSize, nickname, account, status, deptId } = ctx.query;
    const listCondition: IndexCondition = {
      select: 'id nickname status remark createdAt dept account email role pwd -_id',
      populate: { path: 'roleInfo', select: 'roleName roleValue -_id' },
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
    const res = (await ctx.service.vbenAccount.getAccounts(listCondition));
    ctx.helper.success({ ctx, res });
  }

  //  编辑账号状态
  async setAccountStatus() {
    const { ctx } = this;
    const res = await ctx.service.vbenAccount.setAccountStatus(ctx.request.body);
    ctx.helper.success({ ctx, res });
  }

  // 编辑账号
  async editAccount() {
    const { ctx } = this;
    const accountResp = await ctx.service.vbenAccount.editAccount(ctx.request.body) as any;
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
    const currUser = await ctx.model.VbenAccount.findById(user._id);
    // console.log('_currUser', currUser);
    if (currUser) {
      if (currUser.pwd === passwordOld) {
        const resp = await ctx.model.VbenAccount.findOneAndUpdate({ _id: user._id }, { pwd: passwordNew });
        if (resp) ctx.helper.success({ ctx, res: { msg: '密码修改成功' } });
      } else {
        ctx.helper.fail({ ctx, errorType: 'vbenAccountOriginPasswordFail' });
      }
    } else {
      ctx.helper.fail({ ctx, errorType: 'vbenLoginCheckFail' });
    }
  }

  //  删除账号
  async deleteAccount() {
    const { ctx } = this;
    const accountResp = await ctx.service.vbenAccount.deleteAccount(ctx.request.body) as any;
    ctx.helper.success({
      ctx, res: {
        id: accountResp.id,
      },
    });
  }

  //  账号是否存在
  async isAccountExist() {
    const { ctx } = this;
    const { account, id } = ctx.request.body;
    const findResp = await ctx.model.VbenAccount.findOne({ account });
    console.log('_isAccountExist', id, account);
    if (id) {
      const findResp2 = await ctx.model.VbenAccount.findOne({ id });
      if (findResp2?.account === findResp?.account) {
        ctx.helper.success({
          ctx, res: {
            message: 'ok',
          },
        });
        return;
      }
    }
    if (findResp) {
      ctx.helper.fail({
        ctx, errorType: 'vbenAccountExistsFail',
      });
    } else {
      ctx.helper.success({
        ctx, res: {
          message: 'ok',
        },
      });
    }
  }

  //  获取账号详情
  async getAccountDetail() {
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
