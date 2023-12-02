// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportPure from '../../../app/controller/pure';
import ExportTest from '../../../app/controller/test';
import ExportUser from '../../../app/controller/user';
import ExportUtils from '../../../app/controller/utils';
import ExportVben from '../../../app/controller/vben';
import ExportWork from '../../../app/controller/work';
import ExportDatasPureMenuList from '../../../app/controller/datas/pureMenuList';
import ExportDatasVbenMenuAllList from '../../../app/controller/datas/vbenMenuAllList';
import ExportDatasVbenMenuList from '../../../app/controller/datas/vbenMenuList';
import ExportDatasVbenMenuList2 from '../../../app/controller/datas/vbenMenuList2';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    pure: ExportPure;
    test: ExportTest;
    user: ExportUser;
    utils: ExportUtils;
    vben: ExportVben;
    work: ExportWork;
    datas: {
      pureMenuList: ExportDatasPureMenuList;
      vbenMenuAllList: ExportDatasVbenMenuAllList;
      vbenMenuList: ExportDatasVbenMenuList;
      vbenMenuList2: ExportDatasVbenMenuList2;
    }
  }
}
