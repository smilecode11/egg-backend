import { Application } from 'egg';
module.exports = (app: Application) => {
  const { controller, router } = app;

  const jwt = app.jwt as any;
  // router.prefix('/api'); //  指定路由前缀
  router.get('/ping', controller.home.index);

  //  用户相关
  router.post('/api/users/create', controller.user.createByEmail);
  router.get('/api/users/:id', controller.user.getUserById);
  router.post('/api/users/loginByEmail', controller.user.loginByEmail);
  router.post('/api/users/getVeriCode', controller.user.getVeriCode);
  router.post('/api/users/loginByCellphone', controller.user.loginByCellphone);
  router.post('/api/users/current', jwt, controller.user.current);
  // gitee 授权
  router.get('/api/users/passport/gitee', controller.user.giteeOauth);
  router.get('/api/users/passport/gitee/callback', controller.user.oauthByGitee);

  //  作品相关
  router.post('/api/works', jwt, controller.work.createEmptyWork);
  router.get('/api/templates', controller.work.getTemplateList);
  router.get('/api/templates/:id', controller.work.getTemplateById);
  router.get('/api/works', jwt, controller.work.myList);
  router.get('/api/works/:id', controller.work.getWorkById);
  router.patch('/api/works/:id', jwt, controller.work.updateWork);
  router.delete('/api/works/:id', jwt, controller.work.deleteWork);
  router.post('/api/publish/:id', jwt, controller.work.publishWork);
  router.post('/api/publish-template/:id', jwt, controller.work.publishTemplate);
  //  作品 - 渠道(标签)
  router.post('/api/channels', jwt, controller.work.createChannel); //  给 work 添加 channel
  router.get('/api/channels/getWorkChannels/:id', jwt, controller.work.getWorkChannels); //  获取 work 的 channels
  router.patch('/api/channels/:id', jwt, controller.work.updateWorkChannel);
  router.delete('/api/channels/:id', jwt, controller.work.deleteWorkChannel);

  // 工具方法相关
  // router.post('/upload-img', jwt, controller.utils.uploadsByFileAndSharp);
  // router.post('/upload-img', jwt, controller.utils.uploadsByStream);
  // router.post('/upload-img', jwt, controller.utils.uploadsByStreamPipeline);
  // router.post('/upload-img', jwt, controller.utils.uploadMutipleFilesToOSS);
  router.post('/upload-img', jwt, controller.utils.uploadToOSS);
  router.post('/upload-img2', controller.utils.uploadToOSS);
  router.post('/utils/upload-img', jwt, controller.utils.uploadToOSS2);
  router.get('/pages/:id', controller.utils.renderH5Page);
};
