import { Application } from 'egg';
module.exports = (app: Application) => {
  const { controller, router } = app;
  // router.prefix('/vben/api'); //  指定路由前缀
  const jwt = app.jwt as any;
  router.post('/vben/api/login', controller.vben.login);
  router.get('/vben/api/logout', controller.vben.logout);
  router.get('/vben/api/getUserInfo', jwt, controller.vben.getUserInfo);
  router.get('/vben/api/getPermCode', jwt, controller.vben.getPermCode); //  权限码
  router.get('/vben/api/getMenuList', jwt, controller.vben.getMenuList); //  菜单列表
  router.post('/vben/api/utils/uploadImage', jwt, controller.utils.uploadToOSS); //  上传
  // 系统设置相关
  router.post('/vben/api/system/createRole', jwt, controller.vben.createRole); //  创建角色
  router.post('/vben/api/system/setRoleStatus', jwt, controller.vben.setRoleStatus); // 编辑角色状态
  router.post('/vben/api/system/editRole', jwt, controller.vben.editRole); // 编辑角色
  router.post('/vben/api/system/deleteRole', jwt, controller.vben.deleteRole);
  router.get('/vben/api/system/getRoles', jwt, controller.vben.getRoles); // 获取角色列表
  router.get('/vben/api/system/getAllRoleList', jwt, controller.vben.getAllRole); // 获取全部角色
  router.get('/vben/api/system/roles/:id', jwt, controller.vben.getRoleDetail); //  获取单个角色详情
  router.get('/vben/api/system/getAllMenu', jwt, controller.vben.getAllMenuList); // 获取所有菜单
  router.post('/vben/api/system/addMenuItem', jwt, controller.vben.addMenuItem); // 新增菜单
  router.post('/vben/api/system/editMenuItem', jwt, controller.vben.editMenu); // 新增菜单
  router.post('/vben/api/system/deleteMenu', jwt, controller.vben.deleteMenu); // 删除菜单
  router.get('/vben/api/system/getDeptList', jwt, controller.vben.getDepts); //  获取部门列表
  router.get('/vben/api/system/getAllDept', jwt, controller.vben.getAllDepts); // 获取全部部门tree
  router.post('/vben/api/system/addDept', jwt, controller.vben.createDept); // 新增部门
  router.post('/vben/api/system/editDept', jwt, controller.vben.editDept); // 编辑部门
  router.post('/vben/api/system/deleteDept', jwt, controller.vben.deleteDept); // 删除部门
  router.get('/vben/api/system/getAccountList', jwt, controller.vben.getAccountList); //  获取账号列表
  router.post('/vben/api/system/addAccount', jwt, controller.vben.createAccount); // 新增账号
  router.post('/vben/api/system/setAccountStatus', jwt, controller.vben.setAccountStatus); // 编辑角色状态
  router.post('/vben/api/system/editAccount', jwt, controller.vben.editAccount); // 编辑账号
  router.post('/vben/api/system/deleteAccount', jwt, controller.vben.deleteAccount); // 删除账号
  router.post('/vben/api/system/isAccountExist', jwt, controller.vben.isAccountExist); // 账号是否存在
  router.post('/vben/api/system/editPassword', jwt, controller.vben.editAccountPassword); // 修改密码
  router.post('/vben/api/system/getAccountMenuList', jwt, controller.vben.getAccountMenuList); //  获取账号菜单列表
  router.get('/vben/api/system/getMenuListByPage', jwt, controller.vben.getMenuListByPage); //  获取菜单列表

};
