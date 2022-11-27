import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.get('/test/:id', controller.test.index);
  router.post('/test/:id', controller.test.index);
  router.get('/dog', controller.test.getDogImage);
};
