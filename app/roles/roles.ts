import { AbilityBuilder, Ability } from '@casl/ability';
import { Document } from 'mongoose';
import { UserProps } from '../model/user';
export function defineRules(user: UserProps & Document<any, any, UserProps>) {
  const { can, build } = new AbilityBuilder(Ability);
  if (user) {
    if (user.role === 'admin') {
      //  超级管理员
      can('manage', 'all');
    } else {
      //  普通用户权限
      if (user.role === 'normal' || !user.role) {
        //  users 可读取自己的信息, 可改写 nickName、piceture 字段
        can('read', 'User', { _id: user._id });
        can('update', 'User', [ 'nickName', 'picture' ], { _id: user._id });
        //  works 可以读取自己的作品, 可改写和删除自己的作品
        can('create', 'Work', [ 'title', 'content', 'desc', 'coverImg' ]);
        can('read', 'Work', { user: user._id });
        can('update', 'Work', [ 'title', 'content', 'desc', 'coverImg' ], { user: user._id });
        can('delete', 'Work', { user: user._id });
        can('publish', 'Work', { user: user._id }); //  自定义 action, 发布作品使用 publish
        //  channels 可创建、更新、删除自己作品的 channel
        can('create', 'Channel', [ 'name', 'workId' ], { user: user._id });
        can('read', 'Channel', { user: user._id });
        can('update', 'Channel', [ 'name' ], { user: user._id });
        can('delete', 'Channel', { user: user._id });
      }
    }
  }

  return build();
}
