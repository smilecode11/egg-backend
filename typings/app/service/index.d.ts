// This file is created by egg-ts-helper@1.34.5
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportDog from '../../../app/service/Dog';
import ExportPureDept from '../../../app/service/PureDept';
import ExportPureMenu from '../../../app/service/PureMenu';
import ExportPureRole from '../../../app/service/PureRole';
import ExportTest from '../../../app/service/Test';
import ExportVbenAccount from '../../../app/service/VbenAccount';
import ExportVbenDept from '../../../app/service/VbenDept';
import ExportVbenMenu from '../../../app/service/VbenMenu';
import ExportVbenRole from '../../../app/service/VbenRole';
import ExportUser from '../../../app/service/user';
import ExportUtils from '../../../app/service/utils';
import ExportWork from '../../../app/service/work';

declare module 'egg' {
  interface IService {
    dog: AutoInstanceType<typeof ExportDog>;
    pureDept: AutoInstanceType<typeof ExportPureDept>;
    pureMenu: AutoInstanceType<typeof ExportPureMenu>;
    pureRole: AutoInstanceType<typeof ExportPureRole>;
    test: AutoInstanceType<typeof ExportTest>;
    vbenAccount: AutoInstanceType<typeof ExportVbenAccount>;
    vbenDept: AutoInstanceType<typeof ExportVbenDept>;
    vbenMenu: AutoInstanceType<typeof ExportVbenMenu>;
    vbenRole: AutoInstanceType<typeof ExportVbenRole>;
    user: AutoInstanceType<typeof ExportUser>;
    utils: AutoInstanceType<typeof ExportUtils>;
    work: AutoInstanceType<typeof ExportWork>;
  }
}
