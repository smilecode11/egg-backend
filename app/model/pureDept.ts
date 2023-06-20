import { Application } from 'egg';
import { Schema } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

export interface PureDeptProps {
  parentDept: number; // 上级部门
  name: string; // 部门名称
  head: string; // 部门负责人
  headMobile: string; // 负责人手机号
  headEmail: string; // 负责人邮箱
  rank: number; // 排序
  remark: string; // 备注
  status: '0' | '1'; // 0 表示启用 1 表示禁用
  createdAt: Date;
  updatedAt: Date;
  is_delete: '0' | '1'; //  菜单标识, 0 表示正常, 1 表示已删除
}

function initPureDeptModel(app: Application) {
  const AutoIncrement = AutoIncrementFactory(app.mongoose);
  const PureDeptSchema = new Schema<PureDeptProps>({
    parentDept: { type: Number, default: 0 },
    name: { type: String, required: true },
    head: { type: String },
    headMobile: { type: String },
    headEmail: { type: String },
    rank: { type: Number, default: 0 },
    remark: { type: String },
    status: { type: String, default: '0' },
    is_delete: { type: String, default: '0' },
  }, {
    collection: 'pureDepts',
    timestamps: true, // 自动更新 Date 属性
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        delete ret._id;
      },
    },
  });
  PureDeptSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'pure_depts_id_counter' });
  return app.mongoose.model<PureDeptProps>('PureDept', PureDeptSchema);
}

export default initPureDeptModel;

