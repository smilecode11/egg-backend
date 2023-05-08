import { Application } from 'egg';
import { Schema } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

export interface VbenRoleProps {
  roleName: string;
  roleValue: string;
  status: '0' | '1' | '2'; // 0 表示启用 1 表示停用
  remark?: string;
  menuList: string, //  菜单
  createdAt: Date;
  updatedAt: Date;
  is_delete: '0' | '1'; //  账号标识, 0 表示正常, 1 表示已删除
}

function initVbenRoleModel(app: Application) {
  const AutoIncrement = AutoIncrementFactory(app.mongoose);
  const VbenRoleSchema = new Schema<VbenRoleProps>({
    roleName: { type: String, required: true },
    roleValue: { type: String, required: true },
    status: { type: String, default: '0' },
    remark: { type: String },
    menuList: { type: String },
    is_delete: { type: String, default: '0' },
  }, {
    collection: 'vbenRoles',
    timestamps: true, // 自动更新 Date 属性
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        delete ret._id;
      },
    },
  });
  VbenRoleSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'vben_roles_id_counter' });
  return app.mongoose.model<VbenRoleProps>('VbenRole', VbenRoleSchema);
}

export default initVbenRoleModel;

