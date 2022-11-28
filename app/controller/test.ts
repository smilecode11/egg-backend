import { Controller } from 'egg';

export default class TestController extends Controller {
  index() {
    const { ctx } = this;
    // const query = ctx.request.query;
    const query = ctx.query;
    const params = ctx.params;
    const body = ctx.request.body;
    ctx.body = { ...query, ...params, ...body };
    ctx.status = 200;
  }

  async getDogImage() {
    const { service, ctx } = this;
    const resp = await service.dog.show();
    // ctx.body = resp.message;
    // ctx.status = 200;
    const pageData = {
      dogUrl: resp.message,
      title: '模板引擎使用示例',
    };
    console.log('_pageData', pageData);
    await ctx.render('dog.tpl', pageData);
  }

}
