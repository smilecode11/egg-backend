import { Service } from 'egg';
import { PureDeptProps } from '../model/pureDept';
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

export default class PureDeptService extends Service {
  /** 新增部门*/
  async createDept(payload: PureDeptProps) {
    const { ctx } = this;
    const pureDeptCreateData: Partial<PureDeptProps> = {
      ...payload,
      status: '0',
      is_delete: '0',
    };
    return ctx.model.PureDept.create(pureDeptCreateData);
  }

  /** 获取部门列表*/
  async getDepts(condition: IndexCondition) {
    const fCondition = { ...defaultCondition, ...condition };
    const { select, customSort, find } = fCondition;

    const listRes = await this.ctx.model.PureDept
      .find(find).select(select)
      .sort(customSort)
      .lean();

    const count = await this.ctx.model.PureDept.find(find).count();
    return {
      total: count,
      items: listRes,
    };
  }

  /** 编辑部门状态*/
  async setDeptStatus(payload: PureDeptProps & { id: number }) {
    const { ctx } = this;
    const { id, status } = payload;
    return ctx.model.PureDept.findOneAndUpdate({ id }, { status }, { new: true }).lean();
  }

  /** 编辑部门 */
  async editDeptItem(payload: PureDeptProps & { id: number }) {
    const { ctx } = this;
    const { id, ...rest } = payload;
    const newId = id - 0;
    await ctx.model.PureDept.findOneAndUpdate({ id: newId }, { ...rest }, { new: true }).lean();
    return {
      id,
    };
  }

  /** 删除部门*/
  async deleteDept(payload: { id: number }) {
    const { ctx } = this;
    const { id } = payload;
    const newId = id - 0;
    await ctx.model.PureDept.findOneAndUpdate({ id: newId }, { is_delete: '1' }, { new: true }).lean();
    return {
      id,
    };
  }

  /** 获取部门列表*/
  async getAllDeptWithLevel(condition: IndexCondition) {
    const fCondition = { ...defaultCondition, ...condition };
    const { select, customSort, find } = fCondition;

    const listRes = await this.ctx.model.PureDept
      .find(find).select(select)
      .sort(customSort)
      .lean();

    const count = await this.ctx.model.PureDept.find(find).count();
    return {
      total: count,
      items: listRes,
    };
  }
}
