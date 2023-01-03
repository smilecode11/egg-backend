import { Controller } from 'egg';
import inputValidate from '../decorator/inputValidate';

const workCreateRules = {
  title: 'string',
};

export const workErrorMessages = {
  workValidateFail: {
    errno: 101001,
    message: '输入信息验证失败',
  },
  workNoPermissionFail: {
    errno: 101002,
    message: '没有权限',
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
  async updateWork() {
    const { ctx } = this;
    const { id } = ctx.params;
    const permission = await this.checkPermission(id);
    console.log('permission', permission);
    if (!permission) return ctx.helper.fail({ ctx, errorType: 'workNoPermissionFail' });
    const payload = ctx.request.body;
    const res = await ctx.model.Work.findOneAndUpdate({ id }, payload, { new: true }).lean();
    ctx.helper.success({ ctx, res });
  }

  /** 删除作品*/
  async deleteWork() {
    const { ctx } = this;
    const { id } = ctx.params;
    const permission = await this.checkPermission(id);
    if (!permission) return ctx.helper.fail({ ctx, errorType: 'workNoPermissionFail' });
    const res = await ctx.model.Work.findOneAndDelete({ id }).select('_id id title').lean();
    ctx.helper.success({ ctx, res });
  }
}
