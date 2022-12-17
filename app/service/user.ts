import { Service } from 'egg';
import * as $Dysmsapi from '@alicloud/dysmsapi20170525';
import { UserProps } from '../model/user';
export default class UserService extends Service {
  /** 通过邮箱新建用户*/
  public async createByEmail(payload: UserProps) {
    const { ctx } = this;
    const { username, password } = payload;
    const passwordHash = await ctx.genHash(password as string); //  创建用户时, 密码加密后存储
    const UserCreateData: Partial<UserProps> = {
      username,
      password: passwordHash,
      email: username,
    };
    return this.ctx.model.User.create(UserCreateData);
  }

  /** 通过手机登录*/
  async loginByCellphone(cellphone: string) {
    const { ctx, app } = this;
    // 检查用户是否存在 -> 注册/登录 => token
    const user = await this.findByUsername(cellphone);
    if (user) return app.jwt.sign({ username: user.username }, app.config.jwt.secret, { expiresIn: 60 * 60 });
    //  不存在 -> 新建用户注册返回 token
    const userCreateData: Partial<UserProps> = {
      username: cellphone,
      phoneNumber: cellphone,
      nickName: `乐高${cellphone.slice(-4)}`,
      type: 'cellphone',
    };
    const newUser = await ctx.model.User.create(userCreateData);
    return app.jwt.sign({ username: newUser.username }, app.config.jwt.secret, { expiresIn: 60 * 60 });
  }

  /** 阿里 SMS 短信发送服务*/
  async sendSMS(phoneNumber: string, veriCode: string) {
    const { app } = this;
    const sendSMSRequest = new $Dysmsapi.SendSmsRequest({
      signName: '阿里云短信测试',
      phoneNumbers: phoneNumber,
      templateCode: 'SMS_243940007',
      templateParam: `{\"code\":\"${veriCode}\"}`,
    });
    const resp = await app.ALClient.sendSms(sendSMSRequest);
    return resp;
  }

  /** 通过 id 查找用户*/
  async findById(id: string) {
    const result = await this.ctx.model.User.findById(id);
    if (result) {
      return result;
    }
  }

  /** 通过 username 查找用户*/
  async findByUsername(username: string) {
    return this.ctx.model.User.findOne({ username });
  }
}
