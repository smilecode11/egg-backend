
import { Service } from 'egg';
import { PureRoleProps } from '../model/pureRole';
import { IndexCondition } from '../controller/pure';

//  默认的检索条件
const defaultCondition: Required<IndexCondition> = {
  pageIndex: 0,
  pageSize: 10,
  select: '',
  populate: {},
  customSort: { createdAt: -1 },
  find: {},
};

export default class PureRoleService extends Service {
  /** 新增角色*/
  async createRole(payload: PureRoleProps) {
    const { ctx } = this;
    const { name, code, remark, status, menu } = payload;
    const PureRoleCreateData: Partial<PureRoleProps> = {
      name,
      code,
      remark,
      status,
      menu,
    };
    return ctx.model.PureRole.create(PureRoleCreateData);
  }

  /** 获取角色列表*/
  async getRoles(condition: IndexCondition) {
    const fCondition = { ...defaultCondition, ...condition };
    const { pageIndex, pageSize, select/* , populate */, customSort, find } = fCondition;
    const skip = (pageSize * (pageIndex - 1));

    const listRes = await this.ctx.model.PureRole
      .find(find).select(select)/* .populate(populate) */
      .skip(skip)
      .limit(pageSize)
      .sort(customSort)
      .lean();

    const count = await this.ctx.model.PureRole.find(find).count();
    return {
      total: count,
      list: listRes,
    };
  }

  /** 编辑角色状态*/
  async setRoleStatus(payload: PureRoleProps & { id: number }) {
    const { ctx } = this;
    const { id, status } = payload;
    return ctx.model.PureRole.findOneAndUpdate({ id }, { status }, { new: true }).lean();
  }

  /** 编辑角色 */
  async editRole(payload: PureRoleProps & { id: number }) {
    const { ctx } = this;
    const { id, ...rest } = payload;
    const newId = id - 0;
    await ctx.model.PureRole.findOneAndUpdate({ id: newId }, { ...rest }, { new: true }).lean();
    return {
      id,
    };
  }

  /** 删除角色*/
  async deleteRole(payload: { id: number }) {
    const { ctx } = this;
    const { id } = payload;
    const newId = id - 0;
    await ctx.model.PureRole.findOneAndUpdate({ id: newId }, { is_delete: '1' }, { new: true }).lean();
    return {
      id,
    };
  }

  /** 获取全部角色列表*/
  async getAllRoles(condition: IndexCondition) {
    const fCondition = { ...defaultCondition, ...condition };
    const { select, customSort, find } = fCondition;

    const listRes = await this.ctx.model.VbenRole
      .find(find).select(select)
      .sort(customSort)
      .lean();

    const count = await this.ctx.model.VbenRole.find(find).count();
    return {
      total: count,
      items: listRes,
    };
  }
}

