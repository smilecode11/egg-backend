import { Application } from 'egg';
import { Schema } from 'mongoose';

export interface UserProps {
  username: string;
  password: string;
  email?: string;
  nickName?: string;
  picture?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

function initUserModel(app: Application) {
  const UserSchema = new Schema<UserProps>({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String },
    nickName: { type: String },
    picture: { type: String },
    phoneNumber: { type: String },
  }, {
    collection: 'users',
    timestamps: true, // 自动更新 Date 属性
  });
  return app.mongoose.model<UserProps>('User', UserSchema);
}

export default initUserModel;
