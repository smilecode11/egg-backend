import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

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

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    mineLogger: {
      allowMethods: [ 'POST' ],
    },
    mineJwt: { //  jwt.secret 加密串
      secret: 'mine.smile.jsonwebtoken',
    },
  };

  // the return config will combines to EggAppConfig
  return {
    ...config as {}, //  修改 config 不确定的类型, 设置为 {} , 让配置文件更好地在 controller 或 service 中得到联想
    ...bizConfig,
  };
};
