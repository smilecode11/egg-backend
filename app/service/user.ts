import { Service } from 'egg';
import { UserProps } from '../model/user';

export default class UserService extends Service {
  /** 通过邮箱新建用户*/
  public async createByEmail(payload: UserProps) {
    const { ctx } = this;
    const { username, password } = payload;
    const passwordHash = await ctx.genHash(password); //  创建用户时, 密码加密后存储
    const UserCreateData: Partial<UserProps> = {
      username,
      password: passwordHash,
      email: username,
    };
    return this.ctx.model.User.create(UserCreateData);
  }

  /** 通过 id 查找用户*/
  async findById(id: string) {
    const result = await this.ctx.model.User.findById(id);
    if (result) {
      return result;
    }
  }
  async findByUsername(username: string) {
    return this.ctx.model.User.findOne({ username });
  }
}
