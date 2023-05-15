import { Service } from 'egg';
import { VbenDeptProps } from '../model/vbenDept';
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

export default class VbenDeptService extends Service {
  /** 新增部门*/
  async createDept(payload: VbenDeptProps) {
    const { ctx } = this;
    const { deptName, parentDept, remark, status, orderNo } = payload;
    const VbenDeptCreateData: Partial<VbenDeptProps> = {
      deptName,
      parentDept,
      remark,
      status,
      orderNo,
    };
    return ctx.model.VbenDept.create(VbenDeptCreateData);
  }

  /** 编辑部门状态*/
  async setDeptStatus(payload: VbenDeptProps & { id: number }) {
    const { ctx } = this;
    const { id, status } = payload;
    return ctx.model.VbenDept.findOneAndUpdate({ id }, { status }, { new: true }).lean();
  }

  /** 编辑部门 */
  async editDept(payload: VbenDeptProps & { id: number }) {
    const { ctx } = this;
    const { id, ...rest } = payload;
    const newId = id - 0;
    await ctx.model.VbenDept.findOneAndUpdate({ id: newId }, { ...rest }, { new: true }).lean();
    return {
      id,
    };
  }

  /** 删除部门*/
  async deleteDept(payload: { id: number }) {
    const { ctx } = this;
    const { id } = payload;
    const newId = id - 0;
    await ctx.model.VbenDept.findOneAndUpdate({ id: newId }, { is_delete: '1' }, { new: true }).lean();
    return {
      id,
    };
  }

  /** 获取部门列表*/
  async getDepts(condition: IndexCondition) {
    const fCondition = { ...defaultCondition, ...condition };
    const { pageIndex, pageSize, select/* , populate */, customSort, find } = fCondition;
    const skip = (pageSize * (pageIndex - 1));

    const listRes = await this.ctx.model.VbenDept
      .find(find).select(select)/* .populate(populate) */
      .skip(skip)
      .limit(pageSize)
      .sort(customSort)
      .lean();

    const count = await this.ctx.model.VbenDept.find(find).count();
    return {
      total: count,
      items: listRes,
    };
  }

  /** 获取菜单列表*/
  async getAllDepts(condition: IndexCondition) {
    const fCondition = { ...defaultCondition, ...condition };
    const { select, customSort, find } = fCondition;

    const listRes = await this.ctx.model.VbenDept
      .find(find).select(select)
      .sort(customSort)
      .lean();

    const count = await this.ctx.model.VbenDept.find(find).count();
    return {
      total: count,
      items: listRes,
    };
  }
}
