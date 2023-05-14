import { Service } from 'egg';
import { VbenAccountProps } from '../model/vbenAccount';
import { IndexCondition } from '../controller/vben';

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
      count,
      items: listRes,
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
      .populate({ path: 'roleInfo', select: 'roleName menu -_id -roleValue' })
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
}

