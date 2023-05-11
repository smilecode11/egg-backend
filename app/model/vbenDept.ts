import { Application } from 'egg';
import { Schema } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

export interface VbenDeptProps {
  deptName: string;
  parentDept: number;
  status: '0' | '1'; // 0 表示启用 1 表示停用
  orderNo: number; // 排序
  remark?: string;
  createdAt: Date;
  updatedAt: Date;
  is_delete: '0' | '1'; //  账号标识, 0 表示正常, 1 表示已删除
}

function initVbenDeptModel(app: Application) {
  const AutoIncrement = AutoIncrementFactory(app.mongoose);
  const VbenDeptSchema = new Schema<VbenDeptProps>({
    deptName: { type: String, required: true },
    parentDept: { type: Number, default: 0 },
    orderNo: { type: Number },
    status: { type: String, default: '0' },
    remark: { type: String },
    is_delete: { type: String, default: '0' },
  }, {
    collection: 'vbenDepts',
    timestamps: true, // 自动更新 Date 属性
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        delete ret._id;
      },
    },
  });
  VbenDeptSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'vben_depts_id_counter' });
  return app.mongoose.model<VbenDeptProps>('VbenDept', VbenDeptSchema);
}

export default initVbenDeptModel;

