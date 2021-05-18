import Joi from 'joi';

export type CreateUserDto = {
  email: string;
  password: string;
};

export const CreateUserDtoType = Joi.object({
  email: Joi.string(),
  password: Joi.string(),
});
