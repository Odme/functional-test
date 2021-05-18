import { RequestHandler } from 'express';
import HttpException from '@exceptions/HttpException';
import { ObjectSchema } from 'joi';

const validationMiddleware = (
  type: ObjectSchema,
  value: string | 'body' | 'query' | 'params' = 'body',
  // eslint-disable-next-line arrow-body-style
): RequestHandler => {
  return (req, res, next) => {
    type.validateAsync(req[value]).then((result) => {
      if (result.errors) {
        const message = result.errors;
        next(new HttpException(400, message));
      } else {
        next();
      }
    });
  };
};

export default validationMiddleware;
