import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDtoType } from '@dtos/users.dto';
import { Route } from '@/interfaces/route.interface';
import validationMiddleware from '@middlewares/validation.middleware';

const UsersRoute = (): Route => {
  const path = '/users';
  const router = Router();
  const usersController = UsersController();

  router.get(`${path}`, usersController.getUsers);
  router.get(`${path}/:id`, usersController.getUserById);
  router.post(`${path}`, validationMiddleware(CreateUserDtoType, 'body'), usersController.createUser);
  router.put(`${path}/:id`, validationMiddleware(CreateUserDtoType, 'body'), usersController.updateUser);
  router.delete(`${path}/:id`, usersController.deleteUser);

  return { path, router };
};

export default UsersRoute;
