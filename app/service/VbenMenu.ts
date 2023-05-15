import { Service } from 'egg';
import { VbenMenuProps } from '../model/vbenMenu';
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

export default class VbenMenuService extends Service {
  /** 新增菜单*/
  async createMenu(payload: VbenMenuProps) {
    const { ctx } = this;
    const { menuName, parentMenu, type, orderNo, icon, routePath, component, permission, status, isExt, keepalive, show, menuEnName, redirectRoutePath } = payload;
    const vbenMenuCreateData: Partial<VbenMenuProps> = {
      menuName, parentMenu, type, orderNo, icon, routePath, component, permission, status, isExt, keepalive, show, menuEnName, redirectRoutePath,
    };
    return ctx.model.VbenMenu.create(vbenMenuCreateData);
  }

  /** 编辑菜单状态*/
  async setMenuStatus(payload: VbenMenuProps & { id: number }) {
    const { ctx } = this;
    const { id, status } = payload;
    return ctx.model.VbenMenu.findOneAndUpdate({ id }, { status }, { new: true }).lean();
  }

  /** 编辑菜单 */
  async editMenu(payload: VbenMenuProps & { id: number }) {
    const { ctx } = this;
    const { id, ...rest } = payload;
    const newId = id - 0;
    await ctx.model.VbenMenu.findOneAndUpdate({ id: newId }, { ...rest }, { new: true }).lean();
    return {
      id,
    };
  }

  /** 删除菜单*/
  async deleteMenu(payload: { id: number }) {
    const { ctx } = this;
    const { id } = payload;
    const newId = id - 0;
    await ctx.model.VbenMenu.findOneAndUpdate({ id: newId }, { is_delete: '1' }, { new: true }).lean();
    return {
      id,
    };
  }

  /** 获取菜单列表*/
  async getMenus(condition: IndexCondition) {
    const fCondition = { ...defaultCondition, ...condition };
    const { select, customSort, find } = fCondition;

    const listRes = await this.ctx.model.VbenMenu
      .find(find).select(select)
      .sort(customSort)
      .lean();

    const count = await this.ctx.model.VbenMenu.find(find).count();
    return {
      total: count,
      items: listRes,
    };
  }
}
