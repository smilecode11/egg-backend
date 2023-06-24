import { Application } from 'egg';
module.exports = (app: Application) => {
  const { controller, router } = app;
  // router.prefix('/vben/api'); //  指定路由前缀
  const jwt = app.jwt as any;
  router.post('/pureApi/login', controller.pure.login);
  router.post('/pureApi/getUserInfo', jwt, controller.pure.getUserInfo);
  router.post('/pureApi/updateUserInfo', jwt, controller.pure.updateUserInfo); //  更新信息
  router.post('/pureApi/editPassword', jwt, controller.pure.editAccountPassword); // 修改密码
  router.post('/pureApi/editAvatar', jwt, controller.pure.editAvatar); // 修改头像
  router.get('/pureApi/getAsyncRoutes', jwt, controller.pure.getAsyncRoutes); //  获取账号动态路由
  //   router.get('/vben/api/getPermCode', jwt, controller.vben.getPermCode); //  权限码
  // 系统设置相关
  router.post('/pureApi/getRoleList', jwt, controller.pure.getRoleList);
  router.post('/pureApi/createRole', jwt, controller.pure.createRole); //  创建角色
  router.post('/pureApi/setRoleStatus', jwt, controller.pure.setRoleStatus); // 编辑角色状态
  router.post('/pureApi/editRole', jwt, controller.pure.editRole); // 编辑角色
  router.post('/pureApi/deleteRole', jwt, controller.pure.deleteRole);
  router.post('/pureApi/createMenu', jwt, controller.pure.createMenu); // 新增菜单
  router.post('/pureApi/getAllMenuWithLevel', jwt, controller.pure.getAllMenuWithLevel); // 获取所有菜单(层级)
  router.post('/pureApi/setMenuStatus', jwt, controller.pure.setMenuStatus); //  修改菜单状态
  router.post('/pureApi/editMenuItem', jwt, controller.pure.editMenuItem); // 新增菜单
  router.post('/pureApi/deleteMenu', jwt, controller.pure.deleteMenu); // 删除菜单
  router.post('/pureApi/createDept', jwt, controller.pure.createDept); // 新增部门
  router.post('/pureApi/getAllDeptWithLevel', jwt, controller.pure.getAllDeptWithLevel); // 获取所有部门(层级)
  router.post('/pureApi/setDeptStatus', jwt, controller.pure.setDeptStatus); //  修改部门状态
  router.post('/pureApi/editDeptItem', jwt, controller.pure.editDeptItem); // 新增部门
  router.post('/pureApi/deleteDept', jwt, controller.pure.deleteDept); // 删除部门
  router.post('/pureApi/getAccountList', jwt, controller.pure.getAccountList); //  获取账号列表
  router.post('/pureApi/createAccount', jwt, controller.pure.createAccount); // 新增账号
  router.post('/pureApi/setAccountStatus', jwt, controller.pure.setAccountStatus); // 编辑角色状态
  router.post('/pureApi/editAccount', jwt, controller.pure.editAccount); // 编辑账号
  router.post('/pureApi/deleteAccount', jwt, controller.pure.deleteAccount); // 删除账号
  router.post('/pureApi/isAccountExist', jwt, controller.pure.isAccountExist); // 账号是否存在
  router.post('/pureApi/getAccountMenuList', jwt, controller.pure.getAccountMenuList); //  获取账号菜单列表

  // 工具接口
  router.post('/pureApi/upload-img2', controller.utils.uploadToOSS); //  上传图片

};
