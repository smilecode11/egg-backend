import { Service } from 'egg';
import { VbenAccountProps } from '../model/vbenAccount';
import { IndexCondition } from '../controller/vben';
import { VbenMenuProps } from '../model/vbenMenu';

//  默认的检索条件
const defaultCondition: Required<IndexCondition> = {
  pageIndex: 0,
  pageSize: 0,
  select: '',
  populate: {},
  customSort: { createdAt: -1 },
  find: {},
};

export default class VbenAccountService extends Service {
  /** 新增账号*/
  async createAccount(payload: VbenAccountProps) {
    const { ctx } = this;
    const { nickname, pwd, account, email, role, dept, remark, status } = payload;

    const VbenAccountCreateData: Partial<VbenAccountProps> = {
      nickname, pwd, account, email, role, dept,
      remark,
      status,
    };
    return ctx.model.VbenAccount.create(VbenAccountCreateData);
  }

  /** 编辑账号状态*/
  async setAccountStatus(payload: VbenAccountProps & { id: number }) {
    const { ctx } = this;
    const { id, status } = payload;
    return ctx.model.VbenAccount.findOneAndUpdate({ id }, { status }, { new: true }).lean();
  }

  /** 编辑账号 */
  async editAccount(payload: VbenAccountProps & { id: number }) {
    const { ctx } = this;
    const { id, ...rest } = payload;
    const newId = id - 0;
    await ctx.model.VbenAccount.findOneAndUpdate({ id: newId }, { ...rest }, { new: true }).lean();
    return {
      id,
    };
  }

  /** 删除账号*/
  async deleteAccount(payload: { id: number }) {
    const { ctx } = this;
    const { id } = payload;
    const newId = id - 0;
    await ctx.model.VbenAccount.findOneAndUpdate({ id: newId }, { is_delete: '1' }, { new: true }).lean();
    return {
      id,
    };
  }

  /** 获取账号列表*/
  async getAccounts(condition: IndexCondition) {
    const fCondition = { ...defaultCondition, ...condition };
    const { pageIndex, pageSize, select, populate, customSort, find } = fCondition;
    const skip = (pageSize * (pageIndex - 1));

    const listRes = await this.ctx.model.VbenAccount
      .find(find).select(select).populate(populate)
      .skip(skip)
      .limit(pageSize)
      .sort(customSort)
      .lean();

    const count = await this.ctx.model.VbenAccount.find(find).count();
    return {
      total: count,
      items: listRes,
    };
  }


  /** 登录*/
  async loginByAccount({ account, password }) {
    const { app } = this;
    //  1. 检查用户是否存在
    const user = await this.findByAccount(account);
    // console.log('_sever loginByAccount', user);
    //  2. 检查密码是否正确, 正确返回 token
    if (user && user.pwd === password) {
      // 存储用户信息在 jwt 中
      return app.jwt.sign({ account: user.account, _id: user._id }, app.config.jwt.secret, { expiresIn: app.config.jwtExpires });
    }
  }
  //  查找账号是否存在
  async findByAccount(account: string) {
    return this.ctx.model.VbenAccount.findOne({ account });
  }

  /** 获取用户信息*/
  async getAccountInfo() {
    const { ctx } = this;
    //  jwt 中的信息从 ctx.state 中获取 user
    const { user } = ctx.state;
    const userResp = await ctx.model.VbenAccount
      .findById(user._id)
      .select('nickname account email role dept id -_id')
      .populate({ path: 'roleInfo', select: 'roleName menu -_id' })
      .populate({ path: 'deptInfo', select: 'deptName -id -_id' })
      .lean();

    if (userResp) {
      const result = {
        ...userResp,
        ...(userResp as any).roleInfo,
        ...(userResp as any).deptInfo,
      };
      delete result.roleInfo;
      delete result.deptInfo;
      return result;
    }
  }

  /** 获取账号列表*/
  async getAccountMenuListByPage(condition: IndexCondition) {
    const fCondition = { ...defaultCondition, ...condition };
    const { pageIndex, pageSize, select/* , populate */, customSort, find } = fCondition;
    const skip = (pageSize * (pageIndex - 1));

    const listRes = await this.ctx.model.VbenMenu
      .find(find).select(select)/* .populate(populate) */
      .skip(skip)
      .limit(pageSize)
      .sort(customSort)
      .lean();

    const count = await this.ctx.model.VbenMenu.find(find).count();
    return {
      total: count,
      items: listRes,
    };
  }


  /** 获取用户菜单数据*/
  async getAccountMenuList() {
    const { ctx } = this;
    const { user } = ctx.state;
    // 1. 获取用户信息 -> menuId[] -> menuItem[] -> tree menuItem[]
    const currUser = await ctx.model.VbenAccount
      .findById(user._id)
      .select('role dept nickname id')
      .populate({ path: 'roleInfo', select: 'roleName menu' })
      .populate({ path: 'deptInfo', select: 'deptName' })
      .lean();
    if (currUser) {
      // console.log('_currUser', currUser);
      const menuIds = (currUser as any).roleInfo.menu;
      // console.log('_menuIds', menuIds);
      const menuResp = await ctx.model.VbenMenu
        .find({ id: { $in: menuIds }, status: '0', is_delete: '0' })
        .select('-_id -_createdAt -_updatedAt -__v')
        .lean();
      // console.log('_menuResp', menuResp);
      //  处理菜单数据
      const tempMenu = menuResp.map((menuItem: VbenMenuProps & { id?: number }) => ({
        id: menuItem.id,
        parentMenu: menuItem.parentMenu,
        name: menuItem.menuEnName,
        path: menuItem.routePath,
        component: menuItem.component || 'LAYOUT',
        ...(menuItem.redirectRoutePath && { redirect: menuItem.redirectRoutePath }),
        meta: {
          title: menuItem.menuName,
          orderNo: menuItem.orderNo,
          ignoreKeepAlive: menuItem.keepalive === '0',
          showMenu: menuItem.show === '0',
          hideMenu: menuItem.show === '1',
          ...(menuItem.icon && { icon: menuItem.icon }),
        },
      }));
      // console.log('_menuResp', menuResp, tempMenu);
      return tempMenu;
    }
  }
}

