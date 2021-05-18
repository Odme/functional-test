import { Router } from 'express';
import IndexController from '@controllers/index.controller';
import { Route } from '@/interfaces/route.interface';

const IndexRoute = (): Route => {
  const path = '/';
  const router = Router();
  const controller = IndexController();

  router.get(`${path}`, controller.index);

  return { path, router };
};

export default IndexRoute;
