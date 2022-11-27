import { Service } from 'egg';

interface DogResp {
  message: string;
  status: string;
}

export default class DogService extends Service {
  async show() {
    const dogResp = await this.ctx.curl<DogResp>('https://dog.ceo/api/breeds/image/random', {
      dataType: 'json',
    });
    return dogResp.data;
  }
}
