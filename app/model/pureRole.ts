import { Application } from 'egg';
import { Schema } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

export interface PureRoleProps {
  name: string;
  code: string;
  status: '0' | '1' | '2'; // 0 表示启用 1 表示停用
  remark?: string;
  menu: number[], //  菜单
  createdAt: Date;
  updatedAt: Date;
  is_delete: '0' | '1'; //  账号标识, 0 表示正常, 1 表示已删除
}

function initPureRoleModel(app: Application) {
  const AutoIncrement = AutoIncrementFactory(app.mongoose);
  const PureRoleSchema = new Schema<PureRoleProps>({
    name: { type: String, required: true },
    code: { type: String, required: true },
    status: { type: String, default: '0' },
    remark: { type: String },
    menu: { type: Array },
    is_delete: { type: String, default: '0' },
  }, {
    collection: 'pureRoles',
    timestamps: true, // 自动更新 Date 属性
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        delete ret._id;
      },
    },
  });
  PureRoleSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'pure_roles_id_counter' });
  return app.mongoose.model<PureRoleProps>('pureRole', PureRoleSchema);
}

export default initPureRoleModel;

