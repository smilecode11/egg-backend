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
}

