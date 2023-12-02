// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportMineError from '../../../app/middleware/mineError';
import ExportMineJwt from '../../../app/middleware/mineJwt';
import ExportMineLogger from '../../../app/middleware/mineLogger';

declare module 'egg' {
  interface IMiddleware {
    mineError: typeof ExportMineError;
    mineJwt: typeof ExportMineJwt;
    mineLogger: typeof ExportMineLogger;
  }
}
