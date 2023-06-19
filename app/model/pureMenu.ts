import { Application } from 'egg';
import { Schema } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

export interface PureMenuProps {
  type: '0' | '1' | '2'; //  菜单类型 0 目录 1 菜单 2 按钮
  name: string; // 英文标识* 唯一
  routePath: string; // 路由地址
  redirectRoutePath: string; // 重定向路由地址
  component: string; // 组件路径
  title: string; //  菜单名
  icon: string; // 图标
  extraIcon: { //  菜单右侧额外图标
    svg: boolean;// 是否是svg
    name: string;// iconfont名称，目前只支持iconfont，后续拓展
  };
  rank: number; // 排序, 只针对顶级路由
  showLink: '0' | '1'; //  是否在菜单中显示 0 表示是, 1 表示否
  parentMenu: number; // 上级菜单
  showParent: '0' | '1'; // 是否显示父级菜单  0 表示显示, 1 表示否
  roles: Array<string>; // 页面级别权限设置
  auths: Array<string>; //  按钮级别权限设置
  keepAlive: '0' | '1'; // 是否缓存该路由页面 0 表示缓存, 1 表示不缓存
  frameSrc: string; // 需要内嵌的 iframe 链接地址
  frameLoading: boolean; // 内嵌 iframe 是否开启首次加载动画
  transition: {
    // 当前页面动画，这里是第一种模式，比如 name: "fade" 更具体看后面链接 https://cn.vuejs.org/api/built-in-components.html#transition
    name: string;
    // 当前页面进场动画，这里是第二种模式，比如 enterTransition: "animate__fadeInLeft"
    enterTransition: string;
    // 当前页面离场动画，这里是第二种模式，比如 leaveTransition: "animate__fadeOutRight"
    leaveTransition: string;
  };
  // 当前菜单名称或自定义信息禁止添加到标签页
  hiddenTag: '0' | '1' // 是否在标签中隐藏  0 表示隐藏, 1 表示不隐藏
  // 显示在标签页的最大数量，需满足后面的条件：不显示在菜单中的路由并且是通过query或params传参模式打开的页面。在完整版全局搜dynamicLevel即可查看代码演示
  dynamicLevel: number;
  status: '0' | '1'; // 0 表示启用 1 表示禁用
  createdAt: Date;
  updatedAt: Date;
  is_delete: '0' | '1'; //  菜单标识, 0 表示正常, 1 表示已删除
}

function initPureMenuModel(app: Application) {
  const AutoIncrement = AutoIncrementFactory(app.mongoose);
  const PureMenuSchema = new Schema<PureMenuProps>({
    type: { type: String, default: '0' },
    name: { type: String, required: true },
    routePath: { type: String },
    redirectRoutePath: { type: String },
    component: { type: String },
    title: { type: String, required: true },
    icon: { type: String },
    extraIcon: { type: Object },
    rank: { type: Number, default: 0 },
    showLink: { type: String, default: '0' },
    parentMenu: { type: Number, default: 0 },
    showParent: { type: String, default: '0' },
    roles: { type: Array },
    auths: { type: Array },
    keepAlive: { type: String, default: '1' },
    frameSrc: { type: String, default: '' },
    frameLoading: { type: Boolean, default: true },
    transition: {
      type: Object, default: { name: 'fade', enterTransition: 'animate__fadeInLeft', leaveTransition: 'animate__fadeOutRight' },
    },
    hiddenTag: { type: String, default: '1' },
    dynamicLevel: { type: Number },
    status: { type: String, default: '0' },
    is_delete: { type: String, default: '0' },
  }, {
    collection: 'pureMenus',
    timestamps: true, // 自动更新 Date 属性
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        delete ret._id;
      },
    },
  });
  PureMenuSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'pure_menus_id_counter' });
  return app.mongoose.model<PureMenuProps>('PureMenu', PureMenuSchema);
}

export default initPureMenuModel;

