import { Controller } from 'egg';
// import axios from 'axios';
export default class TestController extends Controller {
  async index() {
    const { ctx } = this;
    // const query = ctx.request.query;
    const query = ctx.query;
    const params = ctx.params;
    const body = ctx.request.body;
    // ctx.body = { ...query, ...params, ...body };
    // ctx.status = 200;
    ctx.helper.success({ ctx, res: { ...query, ...params, ...body } });
  }

  async getDogImage() {
    const { service, ctx } = this;
    const resp = await service.dog.show();
    // ctx.body = resp.message;
    // ctx.status = 200;
    //  使用拓展方法
    const message = ctx.app.echo('welcome');
    //  使用扩展属性(缓存 axios 实例), 请求获得数据
    const dogRes = await this.app.axiosInstance({
      url: '/api/breeds/image/random',
      method: 'get',
    });
    const pageData = {
      dogUrl: resp.message,
      title: '模板引擎使用示例',
      message,
      dogInfo: dogRes.data,
    };
    await ctx.render('dog.tpl', pageData);
  }

}
