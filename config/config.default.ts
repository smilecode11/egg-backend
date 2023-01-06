import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { join } from 'path';

// 使用 dotenv, 在文件中读取环境变量
import * as dotenv from 'dotenv';
dotenv.config();

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1669160533114_8306';

  //  全局启用中间件
  config.middleware = [ 'mineLogger', 'mineError' ];

  //  跨域
  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017',
    options: {
      dbName: 'mongoTest2',
      user: 'root',
      pass: '123456',
    },
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      db: 0,
      password: '',
    },
  };

  //  验证
  config.validate = {
    // convert: false,
    // validateRoot: false,
  };

  //  模板
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  };

  // 加密
  config.bcrypt = {
    saltRounds: 10,
  };

  config.jwt = {
    secret: 'smile.jsonwebtoken',
  };

  const aliCloudConfig = {
    accessKeyId: process.env.ALC_ACCESS_KEY,
    accessKeySecret: process.env.ALC_SECRET_KEY,
    endpoint: 'dysmsapi.aliyuncs.com',
  };

  config.oss = {
    client: {
      accessKeyId: process.env.ALC_ACCESS_KEY,
      accessKeySecret: process.env.ALC_SECRET_KEY,
      bucket: 'smile-backend2',
      endpoint: 'oss-cn-hangzhou.aliyuncs.com',
    },
  };

  config.cors = {
    origin: 'http://localhost:8080',
    allowMethods: 'GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH',
  };

  const giteeOauthConfig = {
    cid: process.env.GITEE_CID,
    secret: process.env.GITEE_SECRET,
    redirectURL: 'http://127.0.0.1:7001/api/users/passport/gitee/callback',
    authURL: 'https://gitee.com/oauth/token?grant_type=authorization_code',
    giteeUserAPI: 'https://gitee.com/api/v5/user',
  };

  config.multipart = {
    // mode: 'file',
    tmpdir: join(appInfo.baseDir, '/uploads'),
    whitelist: [ '.png', '.jpg', '.jpeg', '.wbmp', '.webp', '.gif' ], //  上传文件类型限制
    fileSize: '500kb', //  允许上传文件大小
  };

  config.static = {
    dir: [
      { prefix: '/public/', dir: join(appInfo.baseDir, 'app/public') },
      { prefix: '/uploads/', dir: join(appInfo.baseDir, '/uploads') },
    ],
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    mineLogger: {
      allowMethods: [ 'POST' ],
    },
    mineJwt: { //  jwt.secret 加密串
      secret: 'mine.smile.jsonwebtoken',
    },
    aliCloudConfig,
    giteeOauthConfig,
    H5BaseURL: 'http://127.0.0.1:8080',
    baseUrl: 'http://127.0.0.1:7001',
  };

  // the return config will combines to EggAppConfig
  return {
    ...config as {}, //  修改 config 不确定的类型, 设置为 {} , 让配置文件更好地在 controller 或 service 中得到联想
    ...bizConfig,
  };
};
