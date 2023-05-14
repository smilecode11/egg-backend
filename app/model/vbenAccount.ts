import { Application } from 'egg';
import { Schema } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

export interface VbenAccountProps {
  account: string;
  pwd: string;
  role: string; //  账号角色
  dept: string; //  所属部门
  nickname: string; // 账号昵称
  email: string; // 账号邮箱
  remark?: string;
  status: '0' | '1'; // 0 表示启用 1 表示停用
  createdAt: Date;
  updatedAt: Date;
  is_delete: '0' | '1'; //  账号标识, 0 表示正常, 1 表示已删除
}

function initVbenAccountModel(app: Application) {
  const AutoIncrement = AutoIncrementFactory(app.mongoose);
  const VbenAccountSchema = new Schema<VbenAccountProps>({
    account: { type: String, required: true },
    pwd: { type: String, required: true },
    role: { type: String, requred: true },
    dept: { type: String, requred: true },
    nickname: { type: String, requred: true },
    email: { type: String, requred: true },
    status: { type: String, default: '0' },
    remark: { type: String },
    is_delete: { type: String, default: '0' },
  }, {
    collection: 'vbenAccounts',
    timestamps: true, // 自动更新 Date 属性
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        delete ret._id;
      },
    },
  });
  VbenAccountSchema.virtual('roleInfo', {
    ref: 'VbenRole',
    localField: 'role',
    foreignField: 'roleValue',
    justOne: true,
  });
  VbenAccountSchema.virtual('deptInfo', {
    ref: 'VbenDept',
    localField: 'dept',
    foreignField: 'id',
    justOne: true,
  });
  VbenAccountSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'vben_accounts_id_counter' });
  return app.mongoose.model<VbenAccountProps>('VbenAccount', VbenAccountSchema);
}

export default initVbenAccountModel;

