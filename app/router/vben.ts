import { Application } from 'egg';
module.exports = (app: Application) => {
  const { controller, router } = app;
  // router.prefix('/vben/api'); //  指定路由前缀

  router.post('/vben/api/login', controller.vben.login);
  router.get('/vben/api/logout', controller.vben.logout);
  router.get('/vben/api/getUserInfo', controller.vben.getUserInfo);
  router.get('/vben/api/getPermCode', controller.vben.getPermCode); //  权限码
  router.get('/vben/api/getMenuList', controller.vben.getMenuList); //  菜单列表
  router.post('/vben/api/getSms', controller.vben.getSms);
  router.post('/vben/api/resetPassword', controller.vben.resetPassword);
};
