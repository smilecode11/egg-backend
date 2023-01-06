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

  const mineJwt = app.middleware.mineJwt({ secret: app.config.mineJwt.secret });
  const jwt = app.jwt as any;

  //  用户相关
  router.post('/api/users/create', controller.user.createByEmail);
  router.get('/api/users/:id', controller.user.getUserById);
  router.post('/api/users/loginByEmail', controller.user.loginByEmail);
  router.post('/api/users/getVeriCode', controller.user.getVeriCode);
  router.post('/api/users/loginByCellphone', controller.user.loginByCellphone);
  router.post('/api/users/current', mineJwt, controller.user.current);
  router.post('/api/users/current2', jwt, controller.user.current2);
  // gitee 授权
  router.get('/api/users/passport/gitee', controller.user.giteeOauth);
  router.get('/api/users/passport/gitee/callback', controller.user.oauthByGitee);

  //  作品相关
  router.post('/api/works', jwt, controller.work.createEmptyWork);
  router.get('/api/templates', controller.work.getTemplateList);
  router.get('/api/works', jwt, controller.work.myList);
  router.patch('/api/works/:id', jwt, controller.work.updateWork);
  router.delete('/api/works/:id', jwt, controller.work.deleteWork);
  router.post('/api/publish/:id', jwt, controller.work.publishWork);
  router.post('/api/publish-template/:id', jwt, controller.work.publishTemplate);

  // 工具方法相关
  // router.post('/api/upload-img', jwt, controller.utils.uploadsByFileAndSharp);
  // router.post('/api/upload-img', jwt, controller.utils.uploadsByStream);
  // router.post('/api/upload-img', jwt, controller.utils.uploadsByStreamPipeline);
  // router.post('/api/upload-img', jwt, controller.utils.uploadToOSS);
  router.post('/api/upload-img', jwt, controller.utils.uploadMutipleFilesToOSS);
};
