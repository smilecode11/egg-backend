// This file is created by egg-ts-helper@1.34.5
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportUser from '../../../app/model/user';
import ExportVbenMenu from '../../../app/model/vbenMenu';
import ExportVbenRole from '../../../app/model/vbenRole';
import ExportWork from '../../../app/model/work';

declare module 'egg' {
  interface IModel {
    User: ReturnType<typeof ExportUser>;
    VbenMenu: ReturnType<typeof ExportVbenMenu>;
    VbenRole: ReturnType<typeof ExportVbenRole>;
    Work: ReturnType<typeof ExportWork>;
  }
}
