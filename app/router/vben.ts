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


  // 系统设置相关
  router.post('/vben/api/system/createRole', controller.vben.createRole); //  创建角色
  router.post('/vben/api/system/setRoleStatus', controller.vben.setRoleStatus); // 编辑角色状态
  router.post('/vben/api/system/editRole', controller.vben.editRole); // 编辑角色
  router.post('/vben/api/system/deleteRole', controller.vben.deleteRole);
  router.get('/vben/api/system/getRoles', controller.vben.getRoles); // 获取角色列表
  router.get('/vben/api/system/roles/:id', controller.vben.getRoleDetail); //  获取单个角色详情

};
