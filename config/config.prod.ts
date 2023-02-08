import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.baseUrl = 'http://127.0.0.1:7001';

  // config.mongoose = {
  //   url: 'mongodb://127.0.0.1:27017',
  //   options: {
  //     dbName: 'mongoTest2',
  //     user: 'root',
  //     pass: '123456',
  //     useUnifiedTopology: true, //  mongoose旧的解析器准备废弃，要使用新的解析器
  //   },
  // };

  // config.redis = {
  //   client: {
  //     port: 6379,
  //     host: '127.0.0.1',
  //     db: 0,
  //     password: '',
  //   },
  // };

  //  配置允许访问域名
  config.security = {
    domainWhiteList: [ 'http://120.26.167.109' ],
  };
  //  修改 jwt 失效时间
  config.jwtExpires = '2 days';
  //  本地 url 替换
  config.giteeOauthConfig = {
    redirectURL: 'http://120.26.167.109:7001/api/users/passport/gitee/callback',
  };
  config.H5BaseURL = 'http://120.26.167.109:7001';
  //  配置对应的 jwt 事件
  config.jwtExpires = '2 days';

  return config;
};
