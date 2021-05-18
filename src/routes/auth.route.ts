import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDtoType } from '@dtos/users.dto';
import { Route } from '@/interfaces/route.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

const AuthRoute = (): Route => {
  const path = '/';
  const router = Router();
  const authController = AuthController();

  router.post(`${path}signup`, validationMiddleware(CreateUserDtoType, 'body'), authController.signUp);
  router.post(`${path}login`, validationMiddleware(CreateUserDtoType, 'body'), authController.logIn);
  router.post(`${path}logout`, authMiddleware, authController.logOut);

  return { path, router };
};

export default AuthRoute;
