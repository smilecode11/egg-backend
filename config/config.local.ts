import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/test_db',
    options: {
      // user: process.env.MONGO_DB_USERNAME,
      // pass: process.env.MONGO_DB_PASSWORD,
      user: '',
      pass: '',
      useUnifiedTopology: true, //  mongoose旧的解析器准备废弃，要使用新的解析器
    },
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      db: 0,
      // password: process.env.REDIS_PASSWORD,
      password: '',
    },
  };

  return config;
};
