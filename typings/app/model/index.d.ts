// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportPureAccount from '../../../app/model/pureAccount';
import ExportPureDept from '../../../app/model/pureDept';
import ExportPureMenu from '../../../app/model/pureMenu';
import ExportPureRole from '../../../app/model/pureRole';
import ExportUser from '../../../app/model/user';
import ExportVbenAccount from '../../../app/model/vbenAccount';
import ExportVbenDept from '../../../app/model/vbenDept';
import ExportVbenMenu from '../../../app/model/vbenMenu';
import ExportVbenRole from '../../../app/model/vbenRole';
import ExportWork from '../../../app/model/work';

declare module 'egg' {
  interface IModel {
    PureAccount: ReturnType<typeof ExportPureAccount>;
    PureDept: ReturnType<typeof ExportPureDept>;
    PureMenu: ReturnType<typeof ExportPureMenu>;
    PureRole: ReturnType<typeof ExportPureRole>;
    User: ReturnType<typeof ExportUser>;
    VbenAccount: ReturnType<typeof ExportVbenAccount>;
    VbenDept: ReturnType<typeof ExportVbenDept>;
    VbenMenu: ReturnType<typeof ExportVbenMenu>;
    VbenRole: ReturnType<typeof ExportVbenRole>;
    Work: ReturnType<typeof ExportWork>;
  }
}
