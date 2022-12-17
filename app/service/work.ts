import { Service } from 'egg';
import { Types } from 'mongoose';
import { nanoid } from 'nanoid';
import { WorkProps } from '../model/work';

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
}
