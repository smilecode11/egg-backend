import { Service } from 'egg';
import * as $Dysmsapi from '@alicloud/dysmsapi20170525';
import { UserProps } from '../model/user';

interface GiteeUserResp {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  email: string;
}

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

  /** gitee 获取 access_token 验证*/
  async getAccessTokenByGitee(code: string) {
    const { app, ctx } = this;
    const { cid, secret, redirectURL, authURL } = app.config.giteeOauthConfig;
    const { data } = await ctx.curl(authURL, {
      method: 'POST',
      contentType: 'json',
      dataType: 'json',
      data: {
        code,
        client_id: cid,
        redirect_uri: redirectURL,
        client_secret: secret,
      },
    });
    return data;
  }

  /** 获取 gitee 用户信息, 创建用户*/
  async getGiteeUserData(access_token: string) {
    const { app, ctx } = this;
    const { giteeUserAPI } = app.config.giteeOauthConfig;
    const { data } = await ctx.curl<GiteeUserResp>(`${giteeUserAPI}?access_token=${access_token}`, {
      dataType: 'json',
    });
    return data;
  }

  /** gitee 用户登录*/
  async loginByGitee(code: string) {
    const { ctx, app } = this;
    //  1. 获取 access_token;
    const { access_token } = await this.getAccessTokenByGitee(code);
    //  2. 获取用户信息
    const user = await this.getGiteeUserData(access_token);
    //  3. 检查用户是否存在, 存在返回 token, 不存在创建返回 token
    const { id, name, avatar_url, email } = user;
    const stringId = id.toString();
    const existsUser = await this.findByUsername(`Gitee${stringId}`);
    if (existsUser) {
      const token = app.jwt.sign({ username: existsUser.username }, app.config.jwt.secret, { expiresIn: 60 * 60 });
      return token;
    }
    const userCreatedData: Partial<UserProps> = {
      username: `Gitee${stringId}`,
      picture: avatar_url,
      nickName: name,
      email,
      oauthID: stringId,
      type: 'oath',
      provider: 'gitee',
    };
    const newUser = await ctx.model.User.create(userCreatedData);
    const token = app.jwt.sign({ username: newUser.username }, app.config.jwt.secret, { expiresIn: 60 * 60 });
    return token;
  }
}
