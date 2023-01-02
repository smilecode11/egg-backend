import { Service } from 'egg';
import { Types } from 'mongoose';
import { nanoid } from 'nanoid';
import { IndexCondition } from '../controller/work';
import { WorkProps } from '../model/work';

//  默认的检索条件
const defaultCondition: Required<IndexCondition> = {
  pageIndex: 0,
  pageSize: 0,
  select: '',
  populate: {},
  customSort: { createdAt: -1 },
  find: {},
};

export default class WorkService extends Service {
  /** 创建一个空白作品*/
  async createEmptyWork(payload) {
    const { ctx } = this;
    const { username, _id } = ctx.state.user;
    //  生成一个唯一地 URLId
    const uuid = nanoid(6);
    const newEmptyWork: Partial<WorkProps> = {
      ...payload,
      user: Types.ObjectId(_id),
      author: username,
      uuid,
    };
    return ctx.model.Work.create(newEmptyWork);
  }

  /** 获取作品列表*/
  async getList(condition: IndexCondition) {
    const fCondition = { ...defaultCondition, ...condition };
    const { pageIndex, pageSize, select, populate, customSort, find } = fCondition;
    const skip = (pageSize * pageIndex);

    const listRes = await this.ctx.model.Work
      .find(find).select(select).populate(populate)
      .skip(skip)
      .limit(pageSize)
      .sort(customSort)
      .lean();

    const count = await this.ctx.model.Work.find(find).count();

    return {
      pageSize,
      pageIndex,
      count,
      list: listRes,
    };
  }
}
