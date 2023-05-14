import { Application } from 'egg';
module.exports = (app: Application) => {
  const { controller, router } = app;
  // router.prefix('/vben/api'); //  指定路由前缀
  const jwt = app.jwt as any;
  router.post('/vben/api/login', controller.vben.login);
  router.get('/vben/api/getUserInfo', jwt, controller.vben.getUserInfo);
  router.get('/vben/api/logout', controller.vben.logout);
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
  router.get('/vben/api/system/getAllRoleList', controller.vben.getAllRole); // 获取全部角色
  router.get('/vben/api/system/roles/:id', controller.vben.getRoleDetail); //  获取单个角色详情
  router.get('/vben/api/system/getAllMenu', controller.vben.getAllMenuList); // 获取所有菜单
  router.post('/vben/api/system/addMenuItem', controller.vben.addMenuItem); // 新增菜单
  router.post('/vben/api/system/editMenuItem', controller.vben.editMenu); // 新增菜单
  router.post('/vben/api/system/deleteMenu', controller.vben.deleteMenu); // 删除菜单
  router.get('/vben/api/system/getDeptList', controller.vben.getDepts); //  获取部门列表
  router.get('/vben/api/system/getAllDept', controller.vben.getAllDepts); // 获取全部部门tree
  router.post('/vben/api/system/addDept', controller.vben.createDept); // 新增部门
  router.post('/vben/api/system/editDept', controller.vben.editDept); // 编辑部门
  router.post('/vben/api/system/deleteDept', controller.vben.deleteDept); // 删除部门
  router.get('/vben/api/system/getAccountList', controller.vben.getAccountList); //  获取账号列表
  router.post('/vben/api/system/addAccount', controller.vben.createAccount); // 新增账号
  router.post('/vben/api/system/setAccountStatus', controller.vben.setAccountStatus); // 编辑角色状态
  router.post('/vben/api/system/editAccount', controller.vben.editAccount); // 编辑账号
  router.post('/vben/api/system/deleteAccount', controller.vben.deleteAccount); // 删除账号
  router.post('/vben/api/system/isAccountExist', controller.vben.isAccountExist); // 账号是否存在
};
