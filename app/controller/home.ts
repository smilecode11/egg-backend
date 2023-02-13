import { Controller } from 'egg';
import { version as appVersion } from '../../package.json';
export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    const { status } = ctx.app.redis;
    let version;
    try {
      version = ctx.app.mongoose.db.command({ buildInfo: 1 });
    } catch (error) {
      version = 'no API with app.mongoose.db.command({ buildInfo: 1 })';
    }
    ctx.helper.success({
      ctx,
      res: {
        dbVerion: version,
        redisStatus: status,
        appVersion,
        env: process.env.PING_ENV,
        change: '优化 docker 构建',
      },
    });
  }
}
