import { Application } from 'egg';
module.exports = (app: Application) => {
  const { controller, router } = app;
  // router.prefix('/vben/api'); //  指定路由前缀
  // const jwt = app.jwt as any;
  router.post('/pureApi/login', controller.pure.login);
  router.get('/pureApi/getAsyncRoutes', controller.pure.getAsyncRoutes);
  //   router.get('/vben/api/logout', controller.vben.logout);
  //   router.get('/vben/api/getUserInfo', jwt, controller.vben.getUserInfo);
  //   router.get('/vben/api/getPermCode', jwt, controller.vben.getPermCode); //  权限码
  //   router.get('/vben/api/getMenuList', jwt, controller.vben.getMenuList); //  菜单列表
  //   router.post('/vben/api/utils/uploadImage', jwt, controller.utils.uploadToOSS); //  上传
  // 系统设置相关
  router.post('/pureApi/getRoleList', controller.pure.getRoleList);
  router.post('/pureApi/createRole', controller.pure.createRole); //  创建角色
  router.post('/pureApi/setRoleStatus', controller.pure.setRoleStatus); // 编辑角色状态
  router.post('/pureApi/editRole', controller.pure.editRole); // 编辑角色
  router.post('/pureApi/deleteRole', controller.pure.deleteRole);
  router.post('/pureApi/createMenu', controller.pure.createMenu); // 新增菜单
  router.post('/pureApi/getAllMenuWithLevel', controller.pure.getAllMenuWithLevel); // 获取所有菜单(层级)
  router.post('/pureApi/setMenuStatus', controller.pure.setMenuStatus); //  修改菜单状态
  router.post('/pureApi/editMenuItem', controller.pure.editMenuItem); // 新增菜单
  router.post('/pureApi/deleteMenu', controller.pure.deleteMenu); // 删除菜单
  router.post('/pureApi/createDept', controller.pure.createDept); // 新增部门
  router.post('/pureApi/getAllDeptWithLevel', controller.pure.getAllDeptWithLevel); // 获取所有部门(层级)
  router.post('/pureApi/setDeptStatus', controller.pure.setDeptStatus); //  修改部门状态
  router.post('/pureApi/editDeptItem', controller.pure.editDeptItem); // 新增部门
  router.post('/pureApi/deleteDept', controller.pure.deleteDept); // 删除部门
  router.post('/pureApi/getAccountList', controller.pure.getAccountList); //  获取账号列表
  router.post('/pureApi/createAccount', controller.pure.createAccount); // 新增账号
  router.post('/pureApi/setAccountStatus', controller.pure.setAccountStatus); // 编辑角色状态
  router.post('/pureApi/editAccount', controller.pure.editAccount); // 编辑账号
  router.post('/pureApi/deleteAccount', controller.pure.deleteAccount); // 删除账号
  router.post('/pureApi/isAccountExist', controller.pure.isAccountExist); // 账号是否存在
  router.post('/pureApi/editPassword', controller.pure.editAccountPassword); // 修改密码
  router.post('/pureApi/getAccountMenuList', controller.pure.getAccountMenuList); //  获取账号菜单列表

};
