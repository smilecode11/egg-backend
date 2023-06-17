import { Application } from 'egg';

export default (app: Application) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('./router/legoBackend')(app); //  乐高接口

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('./router/vben')(app); //  vben 接口

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('./router/pure')(app); // pure 接口
};
