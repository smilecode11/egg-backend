import { Service } from 'egg';
import { PureMenuProps } from '../model/pureMenu';
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

export default class PureMenuService extends Service {
  /** 新增菜单*/
  async createMenu(payload: PureMenuProps) {
    const { ctx } = this;
    const pureMenuCreateData: Partial<PureMenuProps> = {
      ...payload,
      status: '0',
      is_delete: '0',
    };
    return ctx.model.PureMenu.create(pureMenuCreateData);
  }

  /** 获取菜单列表*/
  async getMenus(condition: IndexCondition) {
    const fCondition = { ...defaultCondition, ...condition };
    const { select, customSort, find } = fCondition;

    const listRes = await this.ctx.model.PureMenu
      .find(find).select(select)
      .sort(customSort)
      .lean();

    const count = await this.ctx.model.PureMenu.find(find).count();
    return {
      total: count,
      items: listRes,
    };
  }

  /** 编辑菜单状态*/
  async setMenuStatus(payload: PureMenuProps & { id: number }) {
    const { ctx } = this;
    const { id, status } = payload;
    return ctx.model.PureMenu.findOneAndUpdate({ id }, { status }, { new: true }).lean();
  }

  /** 编辑菜单 */
  async editMenuItem(payload: PureMenuProps & { id: number }) {
    const { ctx } = this;
    const { id, ...rest } = payload;
    const newId = id - 0;
    await ctx.model.PureMenu.findOneAndUpdate({ id: newId }, { ...rest }, { new: true }).lean();
    return {
      id,
    };
  }

  /** 删除菜单*/
  async deleteMenu(payload: { id: number }) {
    const { ctx } = this;
    const { id } = payload;
    const newId = id - 0;
    await ctx.model.PureMenu.findOneAndUpdate({ id: newId }, { is_delete: '1' }, { new: true }).lean();
    return {
      id,
    };
  }

  /** 获取菜单列表*/
  async getAllMenuWithLevel(condition: IndexCondition) {
    const fCondition = { ...defaultCondition, ...condition };
    const { select, customSort, find } = fCondition;

    const listRes = await this.ctx.model.PureMenu
      .find(find).select(select)
      .sort(customSort)
      .lean();

    const count = await this.ctx.model.PureMenu.find(find).count();
    return {
      total: count,
      items: listRes,
    };
  }
}
