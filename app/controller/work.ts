import { Controller } from 'egg';
import inputValidate from '../decorator/inputValidate';

// type Page = 'home' | 'about';

// interface PageInfo {
//   title?: string;
//   descr?: string;
// }

// const nav: { [K in Page]: PageInfo } = {
//   home: { title: '家' },
//   about: { title: 'about', descr: '关于' },
// };

// const nav2: Record<Page, PageInfo> = {
//   home: { title: '家 2' },
//   about: { title: 'about', descr: '关于' },
// };

// nav;
// nav2;

const workCreateRules = {
  title: 'string',
};

export const workErrorMessages = {
  workValidateFail: {
    errno: 101001,
    message: '输入信息验证失败',
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
  // private validateUserInput(rules: any) {
  //   const { ctx, app } = this;
  //   const errors = app.validator.validate(rules, ctx.request.body);
  //   ctx.logger.warn(errors);
  //   return errors;
  // }

  /** 创建一个作品*/
  @inputValidate(workCreateRules, 'workValidateFail')
  async createEmptyWork() {
    const { ctx, service } = this;
    // const errors = this.validateUserInput(workCreateRules);
    // if (errors) return ctx.helper.fail({ ctx, errorType: 'workValidateFail' });
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
}
