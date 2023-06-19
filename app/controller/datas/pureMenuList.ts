export default [
  {
    path: '/system',
    meta: {
      title: '系统设置',
      icon: 'ep:setting',
    },
    children: [
      {
        path: '/system/role/index',
        name: 'SystemRole',
        meta: {
          title: '角色管理',
        },
      },
      {
        path: '/system/menu/index',
        name: 'SystemMenu',
        meta: {
          title: '菜单管理',
        },
      },
      {
        path: '/system/dept/index',
        name: 'SystemDept',
        meta: {
          title: '部门管理',
        },
      },
      {
        path: '/system/account/index',
        name: 'SystemAccount',
        meta: {
          title: '账号管理',
        },
      },
      {
        path: '/system/password/index',
        name: 'SystemPassword',
        meta: {
          title: '密码设置',
        },
      },
    ],
  },
];
