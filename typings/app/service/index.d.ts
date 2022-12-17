// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportDog from '../../../app/service/Dog';
import ExportTest from '../../../app/service/Test';
import ExportUser from '../../../app/service/user';
import ExportWork from '../../../app/service/work';

declare module 'egg' {
  interface IService {
    dog: AutoInstanceType<typeof ExportDog>;
    test: AutoInstanceType<typeof ExportTest>;
    user: AutoInstanceType<typeof ExportUser>;
    work: AutoInstanceType<typeof ExportWork>;
  }
}
