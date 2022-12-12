import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  const myLogger = app.middleware.mineLogger({
    allowMethods: [ 'GET' ],
  }, app);

  router.get('/', controller.home.index);
  router.get('/test/:id', controller.test.index);
  router.post('/test/:id', controller.test.index);
  //  路由中配置使用中间件
  router.get('/dog', myLogger, controller.test.getDogImage);


  //  用户相关
  router.post('/api/users/create', controller.user.createByEmail);
  router.get('/api/users/:id', controller.user.getUserById);
  router.post('/api/users/loginByEmail', controller.user.loginByEmail);
  router.post('/api/users/current', controller.user.current);
};
