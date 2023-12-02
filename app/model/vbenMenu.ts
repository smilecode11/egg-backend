import { Application } from 'egg';
import { Schema } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

export interface VbenMenuProps {
  menuName: string; //  菜单名
  menuEnName: string; // 英文标识
  type: '0' | '1' | '2'; //  菜单类型 0 目录 1 菜单 2 按钮
  redirectRoutePath: string; // 重定向路由地址
  parentMenu: number; // 上级菜单
  orderNo: number; // 排序
  icon: string; // 图标
  routePath: string; // 路由地址
  component: string; // 组件路径
  permission: string; // 权限标识
  status: '0' | '1'; // 0 表示启用 1 表示禁用
  isExt: '0' | '1'; // 0 表示不是外链 1表示外链
  keepalive: '0' | '1'; // 0 表示不缓存 1 表示缓存
  show: '0' | '1'; // 0 表示显示, 1 表示不显示
  createdAt: Date;
  updatedAt: Date;
  is_delete: '0' | '1'; //  菜单标识, 0 表示正常, 1 表示已删除
}

function initVbenMenuModel(app: Application) {
  const AutoIncrement = AutoIncrementFactory(app.mongoose);
  const VbenMenuSchema = new Schema<VbenMenuProps>({
    menuName: { type: String, required: true },
    menuEnName: { type: String },
    type: { type: String, default: '0' },
    redirectRoutePath: { type: String },
    parentMenu: { type: Number, default: 0 },
    orderNo: { type: Number, default: 0 },
    icon: { type: String },
    routePath: { type: String },
    component: { type: String },
    permission: { type: String },
    status: { type: String, default: '0' },
    isExt: { type: String, default: '0' },
    keepalive: { type: String, default: '0' },
    show: { type: String, default: '0' },
    is_delete: { type: String, default: '0' },
  }, {
    collection: 'vbenMenus',
    timestamps: true, // 自动更新 Date 属性
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        delete ret._id;
      },
    },
  });
  VbenMenuSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'vben_menus_id_counter' });
  return app.mongoose.model<VbenMenuProps>('VbenMenu', VbenMenuSchema);
}

export default initVbenMenuModel;

