import { Controller } from 'egg';
import inputValidate from '../decorator/inputValidate';
import checkPermission from '../decorator/checkPermission';
import { nanoid } from 'nanoid';

const workCreateRules = {
  title: 'string',
};

const workCreateChannelRules = {
  name: 'string',
  workId: 'string',
};

export const workErrorMessages = {
  workValidateFail: {
    errno: 102001,
    message: '输入信息验证失败',
  },
  workNoPermissionFail: {
    errno: 102002,
    message: '没有权限',
  },
  channelOperaFail: {
    errno: 102005,
    message: '作品渠道操作失败',
  },
};

export interface IndexCondition {
  pageIndex?: number;
  pageSize?: number;
  select?: string | string[];
  populate?: { path?: string, select?: string };
  customSort?: Record<string, any>;
  find?: Record<string, any>;
}

export default class WorkController extends Controller {

  /** 创建一个作品*/
  @inputValidate(workCreateRules, 'workValidateFail')
  async createEmptyWork() {
    const { ctx, service } = this;
    const workData = await service.work.createEmptyWork(ctx.request.body);
    ctx.helper.success({ ctx, res: workData });
  }

  /** 获取我的作品列表*/
  async myList() {
    const { ctx } = this;
    const userId = ctx.state.user._id;
    const { pageIndex, pageSize, isTemplate, title } = ctx.query;
    const findCondition = {
      user: userId,
      ...(title && { title: { $regex: title, $options: 'i' } }),
      ...(isTemplate && { isTemplate: !!parseInt(isTemplate) }),
    };
    const listCondition: IndexCondition = {
      select: 'id author copiedCount coverImg desc title user isHot createAt',
      populate: { path: 'user', select: 'username nickName picture' },
      find: findCondition,
      ...(pageSize && { pageSize: parseInt(pageSize) }),
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
    };
    const res = await ctx.service.work.getList(listCondition);
    ctx.helper.success({ ctx, res });
  }

  /** 获取模板列表*/
  async getTemplateList() {
    const { ctx } = this;
    const { pageIndex, pageSize, title } = ctx.query;
    const listCondition: IndexCondition = {
      select: 'id author copiedCount coverImg desc title user isHot createdAt',
      populate: { path: 'user', select: 'username nickName picture' },
      find: {
        isPublic: true,
        isTemplate: true,
        ...(title && { title: { $regex: title, $options: 'i' } }),
      },
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    };
    const res = await ctx.service.work.getList(listCondition);
    ctx.helper.success({ ctx, res });
  }

  /** 验证修改权限*/
  async checkPermission(id: number) {
    const { ctx } = this;
    const userId = ctx.state.user._id;
    const certainWork = await ctx.model.Work.findOne({ id });
    if (!certainWork) return false;
    return userId === certainWork.user.toString();
  }

  /** 更新作品*/
  @checkPermission('Work', 'workNoPermissionFail')
  async updateWork() {
    const { ctx } = this;
    const { id } = ctx.params;
    const payload = ctx.request.body;
    const res = await ctx.model.Work.findOneAndUpdate({ id }, payload, { new: true }).lean();
    ctx.helper.success({ ctx, res });
  }

  /** 删除作品*/
  @checkPermission('Work', 'workNoPermissionFail')
  async deleteWork() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await ctx.model.Work.findOneAndDelete({ id }).select('_id id title').lean();
    ctx.helper.success({ ctx, res });
  }

  /** 发布作品/模板*/
  @checkPermission('Work', 'workNoPermissionFail', { action: 'publish', key: 'id', value: { type: 'params', valueKey: 'id'} })
  async publish(isTemplate: boolean) {
    const { ctx } = this;
    const url = await this.service.work.publish(ctx.params.id, isTemplate);
    ctx.helper.success({ ctx, res: { url } });
  }

  /** 发布作品*/
  async publishWork() {
    await this.publish(false);
  }

  /** 发布模板*/
  async publishTemplate() {
    await this.publish(true);
  }

  /** 创建作品的 channels*/
  @inputValidate(workCreateChannelRules, 'workValidateFail')
  @checkPermission({ casl: 'Channel', mongoose: 'Work' }, 'workNoPermissionFail', { value: { type: 'body', valueKey: 'workId' } })
  async createChannel() {
    const { ctx } = this;
    const { name, workId } = ctx.request.body;
    const newChannel = {
      uuid: nanoid(5),
      name,
    };
    const res = await ctx.model.Work.findOneAndUpdate({ id: parseInt(workId) }, { $push: { channels: newChannel } }, { new: true });
    if (res) return ctx.helper.success({ ctx, res: newChannel });
    ctx.helper.fail({ ctx, errorType: 'channelOperaFail' });
  }

  /** 获取作品的 channels*/
  @checkPermission({ casl: 'Channel', mongoose: 'Work' }, 'workNoPermissionFail')
  async getWorkChannels() {
    const { ctx } = this;
    const { id } = ctx.params;
    const selectWork = await ctx.model.Work.findOne({ id });
    if (selectWork) {
      const { channels } = selectWork;
      ctx.helper.success({ ctx, res: { count: channels && channels.length || 0, list: channels } });
    } else {
      ctx.helper.fail({ ctx, errorType: 'channelOperaFail' });
    }
  }

  /** 更新作品的 channels*/
  @checkPermission({ casl: 'Channel', mongoose: 'Work' }, 'workNoPermissionFail', { key: 'channels.uuid' })
  async updateWorkChannel() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { name } = ctx.request.body;
    await ctx.model.Work.findOneAndUpdate({ 'channels.uuid': id }, { $set: { 'channels.$.name': name } });
    ctx.helper.success({ ctx, res: { name } });
  }

  /** 删除作品的 channels*/
  @checkPermission({ casl: 'Channel', mongoose: 'Work' }, 'workNoPermissionFail', { key: 'channels.uuid' })
  async deleteWorkChannel() {
    const { ctx } = this;
    const { id } = ctx.params;
    const selectWork = await ctx.model.Work.findOneAndUpdate({ 'channels.uuid': id }, { $pull: { channels: id } }, { new: true });
    ctx.helper.success({ ctx, res: selectWork });
  }

}
