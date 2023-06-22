import { Service } from 'egg';
import { PureAccountProps } from '../model/pureAccount';
import { IndexCondition } from '../controller/pure';
import { PureMenuProps } from '../model/pureMenu';

//  默认的检索条件
const defaultCondition: Required<IndexCondition> = {
  pageIndex: 0,
  pageSize: 0,
  select: '',
  populate: {},
  customSort: { createdAt: -1 },
  find: {},
};

export default class PureAccountService extends Service {
  /** 新增账号*/
  async createAccount(payload: PureAccountProps) {
    const { ctx } = this;
    const { nickname, pwd, account, phone, email, role, dept, remark, status } = payload;
    const PureAccountCreateData: Partial<PureAccountProps> = {
      nickname, pwd, account, email, role, dept,
      remark,
      phone,
      status,
    };
    return ctx.model.PureAccount.create(PureAccountCreateData);
  }

  /** 编辑账号状态*/
  async setAccountStatus(payload: PureAccountProps & { id: number }) {
    const { ctx } = this;
    const { id, status } = payload;
    return ctx.model.PureAccount.findOneAndUpdate({ id }, { status }, { new: true }).lean();
  }

  /** 编辑账号 */
  async editAccount(payload: PureAccountProps & { id: number }) {
    const { ctx } = this;
    const { id, ...rest } = payload;
    const newId = id - 0;
    await ctx.model.PureAccount.findOneAndUpdate({ id: newId }, { ...rest }, { new: true }).lean();
    return {
      id,
    };
  }

  /** 删除账号*/
  async deleteAccount(payload: { id: number }) {
    const { ctx } = this;
    const { id } = payload;
    const newId = id - 0;
    await ctx.model.PureAccount.findOneAndUpdate({ id: newId }, { is_delete: '1' }, { new: true }).lean();
    return {
      id,
    };
  }

  /** 获取账号列表*/
  async getAccounts(condition: IndexCondition) {
    const fCondition = { ...defaultCondition, ...condition };
    const { pageIndex, pageSize, select, customSort, find } = fCondition;
    const skip = (pageSize * (pageIndex - 1));
    const listRes = await this.ctx.model.PureAccount
      .find(find).select(select)
      .populate({ path: 'roleInfo', select: 'name id -_id' })
      .populate({ path: 'deptInfo', select: 'name id -_id' })
      .skip(skip)
      .limit(pageSize)
      .sort(customSort)
      .lean();

    const count = await this.ctx.model.PureAccount.find(find).count();
    return {
      total: count,
      list: listRes,
    };
  }

  /** 登录*/
  async loginByAccount({ account, password }) {
    const { app } = this;
    //  1. 检查用户是否存在
    const user = await this.findByAccount(account);
    //  2. 检查密码是否正确, 正确返回 token
    if (user && user.pwd === password) {
      // 存储用户信息在 jwt 中
      return app.jwt.sign({ account: user.account, _id: user._id }, app.config.jwt.secret, { expiresIn: app.config.jwtExpires });
    }
  }
  //  查找账号是否存在
  async findByAccount(account: string) {
    return this.ctx.model.PureAccount.findOne({ account });
  }

  /** 获取用户信息*/
  async getAccountInfo() {
    const { ctx } = this;
    const { user } = ctx.state;
    const userResp = await ctx.model.PureAccount
      .findById(user._id)
      .select('nickname account email role dept id -_id')
      .populate({ path: 'roleInfo', select: 'name menu -_id -roleValue' })
      .populate({ path: 'deptInfo', select: 'name -id -_id' })
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

  /** 获取用户菜单数据*/
  async getAccountMenuList() {
    const { ctx } = this;
    const { user } = ctx.state;
    // 1. 获取用户信息 -> menuId[] -> menuItem[] -> tree menuItem[]
    const currUser = await ctx.model.PureAccount
      .findById(user._id)
      .select('role dept nickname id')
      .populate({ path: 'roleInfo', select: 'name menu' })
      .populate({ path: 'deptInfo', select: 'name' })
      .lean();
    if (currUser) {
      // console.log('_currUser', currUser);
      const menuIds = (currUser as any).roleInfo.menu;
      // console.log('_menuIds', menuIds);
      const menuResp = await ctx.model.PureMenu
        .find({ id: { $in: menuIds }, status: '0', is_delete: '0' })
        .select('-_id -_createdAt -_updatedAt -__v')
        .lean();
      // console.log('_menuResp', menuResp);
      //  处理菜单数据
      const tempMenu = menuResp.map((menuItem: PureMenuProps & { id?: number }) => ({
        id: menuItem.id,
        parentMenu: menuItem.parentMenu,
        name: menuItem.name,
        path: menuItem.routePath,
        ...(menuItem.redirectRoutePath && { redirect: menuItem.redirectRoutePath }),
        meta: {
          title: menuItem.title,
          rank: menuItem.rank,
          keepAlive: menuItem.keepAlive === '0',
          showLink: menuItem.showLink === '0',
          showParent: menuItem.showParent === '0',
          roles: menuItem.roles,
          auths: menuItem.auths,
          hiddenTag: menuItem.hiddenTag === '0',
          ...(menuItem.icon && { icon: menuItem.icon }),
        },
      }));
      // console.log('_menuResp', menuResp, tempMenu);
      return tempMenu;
    }
  }
}

