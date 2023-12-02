export default [
  // 控制台
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: 'LAYOUT',
    redirect: '/dashboard/workbench',
    meta: {
      title: '控制台', // 'routes.dashboard.dashboard',
      icon: 'ant-design:home-outlined',
    },
    children: [{
      path: 'workbench',
      name: 'Workbench',
      component: '/dashboard/workbench/index',
      meta: {
        title: '工作台',
      },
    },
    {
      path: 'analysis',
      name: 'Analysis',
      component: '/dashboard/analysis/index',
      meta: {
        title: '分析页',
      },
    }],
  },
  // 地图
  {
    path: '/map',
    name: 'Map',
    component: 'Layout',
    redirect: '/map/basic',
    meta: {
      title: '地图 Learn',
      icon: 'ant-design:heat-map-outlined',
      orderNo: 2001,
    },
    children: [
      {
        path: 'basic',
        name: 'MapBasic',
        component: '/map/basic/index',
        meta: {
          title: '地图基础',
        },
      },
      {
        path: 'advanced',
        name: 'MapAdvanced',
        component: '/map/advanced/index',
        meta: {
          title: '地图进阶',
        },
      },
    ],
  },
  // 系统设置
  {
    path: '/system',
    name: 'System',
    component: 'LAYOUT',
    redirect: '/system/account',
    meta: {
      title: '系统设置',
      icon: 'ion:settings-outline',
      orderNo: 2000,
    },
    children: [
      {
        path: 'account',
        name: 'AccountManagement',
        component: '/basics/system/account/index',
        meta: {
          title: '账号管理',
          ignoreKeepAlive: true,
        },
      },
      // 隐藏子菜单, 账号详情
      {
        path: 'account_detail/:id',
        name: 'AccountDetail',
        component: '/basics/system/account/AccountDetail',
        meta: {
          hideMenu: true,
          title: '账号详情',
          currentActiveMenu: '/system/account',
          showMenu: false,
          ignoreKeepAlive: true,
        },
      },
      {
        path: 'role',
        name: 'RoleManagement',
        component: '/basics/system/role/index',
        meta: {
          title: '角色管理',
          ignoreKeepAlive: true,
        },
      },
      {
        path: 'menu',
        name: 'MenuManagement',
        component: '/basics/system/menu/index',
        meta: {
          title: '菜单管理',
          ignoreKeepAlive: true,
        },
      },
      {
        path: 'dept',
        name: 'DeptManagement',
        component: '/basics/system/dept/index',
        meta: {
          title: '部门管理',
          ignoreKeepAlive: true,
        },
      },
      {
        path: 'changePassword',
        name: 'ChangePassword',
        component: '/basics/system/password/index',
        meta: {
          title: '修改密码',
          ignoreKeepAlive: true,
        },
      },
    ],
  },
];
