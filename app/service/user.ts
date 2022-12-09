import { Service } from 'egg';
import { UserProps } from '../model/user';

export default class UserService extends Service {
  /** 通过邮箱新建用户*/
  public async createByEmail(payload: UserProps) {
    const { username, password } = payload;
    const UserCreateData: Partial<UserProps> = {
      username,
      password,
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
