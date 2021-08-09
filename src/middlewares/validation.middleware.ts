import {
  NextFunction, Request, RequestHandler, Response,
} from 'express';
import { ObjectSchema } from 'joi';

const validationMiddleware = (
  type: ObjectSchema,
  value: string | 'body' | 'query' | 'params' | 'header',
): RequestHandler => async (req: Request, res: Response, next: NextFunction) => {
  const validation = type.validate(req[value]);
  const { error: validationError } = validation;
  if (validationError) {
    const { details } = validationError;
    const response = details.map(({ message }) => message).join(', ');
    return res.status(400).send({ error: response });
  }
  return next();
};

export default validationMiddleware;
