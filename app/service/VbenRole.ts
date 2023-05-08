import { Service } from 'egg';
import { VbenRoleProps } from '../model/vbenRole';
import { IndexCondition } from '../controller/vben';

//  默认的检索条件
const defaultCondition: Required<IndexCondition> = {
  pageIndex: 0,
  pageSize: 0,
  select: '',
  // populate: {},
  customSort: { createdAt: -1 },
  find: {},
};

export default class VbenRoleService extends Service {
  /** 新增角色*/
  async createRole(payload: VbenRoleProps) {
    const { ctx } = this;
    const { roleName, roleValue, remark, status, menuList } = payload;
    const VbenRoleCreateData: Partial<VbenRoleProps> = {
      roleName,
      roleValue,
      remark,
      status,
      menuList,
    };
    return ctx.model.VbenRole.create(VbenRoleCreateData);
  }

  /** 编辑角色状态*/
  async setRoleStatus(payload: VbenRoleProps & { id: number }) {
    const { ctx } = this;
    const { id, status } = payload;
    return ctx.model.VbenRole.findOneAndUpdate({ id }, { status }, { new: true }).lean();
  }

  /** 编辑角色 */
  async editRole(payload: VbenRoleProps & { id: number }) {
    const { ctx } = this;
    const { id, ...rest } = payload;
    const newId = id - 0;
    await ctx.model.VbenRole.findOneAndUpdate({ id: newId }, { ...rest }, { new: true }).lean();
    return {
      id,
    };
  }

  /** 删除角色*/
  async deleteRole(payload: { id: number }) {
    const { ctx } = this;
    const { id } = payload;
    const newId = id - 0;
    await ctx.model.VbenRole.findOneAndUpdate({ id: newId }, { is_delete: '1' }, { new: true }).lean();
    return {
      id,
    };
  }

  /** 获取角色列表*/
  async getRoles(condition: IndexCondition) {
    const fCondition = { ...defaultCondition, ...condition };
    const { pageIndex, pageSize, select/* , populate */, customSort, find } = fCondition;
    const skip = (pageSize * (pageIndex - 1));

    const listRes = await this.ctx.model.VbenRole
      .find(find).select(select)/* .populate(populate) */
      .skip(skip)
      .limit(pageSize)
      .sort(customSort)
      .lean();

    const count = await this.ctx.model.VbenRole.find(find).count();
    return {
      count,
      items: listRes,
    };
  }
}
