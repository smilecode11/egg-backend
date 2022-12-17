import { Application } from 'egg';
import { ObjectId, Schema, SchemaTypes } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

export interface ChannelProps {
  name: string;
  id: string;
}

export interface WorkProps {
  id?: number;
  uuid: string;
  title: string;
  desc: string;
  coverImg?: string;
  content?: { [key: string]: any };
  isTemplate?: boolean;
  isPublic?: boolean;
  isHot?: boolean;
  author: string;
  copiedCount: number;
  statu?: 0 | 1 | 2;
  user: ObjectId;
  latestPublishAt?: Date;
  channels?: ChannelProps[];
}

function initWorkModel(app: Application) {
  const AutoIncrement = AutoIncrementFactory(app.mongoose);

  const WorkSchema = new Schema<WorkProps>({
    uuid: { type: String, unique: true },
    title: { type: String },
    desc: { type: String },
    coverImg: { type: String },
    content: { type: Object },
    isTemplate: { type: Boolean },
    isPublic: { type: Boolean },
    isHot: { type: Boolean },
    author: { type: String },
    copiedCount: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
    user: { type: SchemaTypes.ObjectId, ref: 'User' },
    latestPublishAt: { type: Date },
    channels: { type: Array },
  }, {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  });
  WorkSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'work_id_counter' });

  return app.mongoose.model<WorkProps>('Work', WorkSchema);
}

export default initWorkModel;
