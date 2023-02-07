import { Application } from 'egg';
import { Schema } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

export interface UserProps {
  username: string;
  password?: string;
  email?: string;
  nickName?: string;
  picture?: string;
  phoneNumber?: string;
  type: 'email' | 'cellphone' | 'oauth'; //  区分用户注册方式
  provider?: 'gitee' | 'weixin', //  授权源
  oauthID?: string;
  createdAt: Date;
  updatedAt: Date;
  role: 'admin' | 'payed' | 'normal'
}

function initUserModel(app: Application) {
  const AutoIncrement = AutoIncrementFactory(app.mongoose);
  const UserSchema = new Schema<UserProps>({
    username: { type: String, unique: true, required: true },
    password: { type: String },
    email: { type: String },
    nickName: { type: String },
    picture: { type: String },
    phoneNumber: { type: String },
    type: { type: String, default: 'email' },
    oauthID: { type: String },
    provider: { type: String, default: '' },
    role: { type: String, default: 'normal' },
  }, {
    collection: 'users',
    timestamps: true, // 自动更新 Date 属性
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
  });
  UserSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'users_id_counter' });
  return app.mongoose.model<UserProps>('User', UserSchema);
}

export default initUserModel;
