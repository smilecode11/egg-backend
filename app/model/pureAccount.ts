import { Application } from 'egg';
import { Schema } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

export interface PureAccountProps {
  account: string; //  账号名称
  nickname: string; // 账号昵称
  role: number; //  账号角色
  dept: number; //  所属部门
  pwd: string;
  phone: string; // 手机号
  email: string; // 账号邮箱
  remark?: string;
  status: '0' | '1'; // 0 表示启用 1 表示停用
  createdAt: Date;
  updatedAt: Date;
  is_delete: '0' | '1'; //  账号标识, 0 表示正常, 1 表示已删除
}

function initPureAccountModel(app: Application) {
  const AutoIncrement = AutoIncrementFactory(app.mongoose);
  const PureAccountSchema = new Schema<PureAccountProps>({
    account: { type: String, required: true },
    phone: { type: String, requred: true },
    email: { type: String, requred: true },
    pwd: { type: String, required: true },
    role: { type: Number, requred: true },
    dept: { type: Number, requred: true },
    nickname: { type: String, requred: true },
    status: { type: String, default: '0' },
    remark: { type: String },
    is_delete: { type: String, default: '0' },
  }, {
    collection: 'pureAccounts',
    timestamps: true, // 自动更新 Date 属性
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        delete ret._id;
      },
    },
  });
  PureAccountSchema.virtual('roleInfo', {
    ref: 'PureRole',
    localField: 'role',
    foreignField: 'id',
    justOne: true,
  });
  PureAccountSchema.virtual('deptInfo', {
    ref: 'PureDept',
    localField: 'dept',
    foreignField: 'id',
    justOne: true,
  });
  PureAccountSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'pure_accounts_id_counter' });
  return app.mongoose.model<PureAccountProps>('PureAccount', PureAccountSchema);
}

export default initPureAccountModel;

