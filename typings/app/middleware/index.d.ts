// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportMineLogger from '../../../app/middleware/mineLogger';

declare module 'egg' {
  interface IMiddleware {
    mineLogger: typeof ExportMineLogger;
  }
}
