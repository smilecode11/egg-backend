import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const jwt = app.jwt as any;
  router.prefix('/api'); //  指定路由前缀

  //  用户相关
  router.post('/users/create', controller.user.createByEmail);
  router.get('/users/:id', controller.user.getUserById);
  router.post('/users/loginByEmail', controller.user.loginByEmail);
  router.post('/users/getVeriCode', controller.user.getVeriCode);
  router.post('/users/loginByCellphone', controller.user.loginByCellphone);
  router.post('/users/current', jwt, controller.user.current);
  // gitee 授权
  router.get('/users/passport/gitee', controller.user.giteeOauth);
  router.get('/users/passport/gitee/callback', controller.user.oauthByGitee);

  //  作品相关
  router.post('/works', jwt, controller.work.createEmptyWork);
  router.get('/templates', controller.work.getTemplateList);
  router.get('/works', jwt, controller.work.myList);
  router.patch('/works/:id', jwt, controller.work.updateWork);
  router.delete('/works/:id', jwt, controller.work.deleteWork);
  router.post('/publish/:id', jwt, controller.work.publishWork);
  router.post('/publish-template/:id', jwt, controller.work.publishTemplate);

  // 工具方法相关
  // router.post('/upload-img', jwt, controller.utils.uploadsByFileAndSharp);
  // router.post('/upload-img', jwt, controller.utils.uploadsByStream);
  // router.post('/upload-img', jwt, controller.utils.uploadsByStreamPipeline);
  // router.post('/upload-img', jwt, controller.utils.uploadMutipleFilesToOSS);
  router.post('/upload-img', jwt, controller.utils.uploadToOSS);
  router.get('/pages/:id', controller.utils.renderH5Page);

};
