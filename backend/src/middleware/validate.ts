import { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { HttpStatus, ErrorMessage } from '../../../shared/src/types/api';

export const validate = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const error = result.error;
      // return a concise error payload using shared enums
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: ErrorMessage.INVALID_INPUT, errors: error.format() });
    }
    // replace body with parsed data
    req.body = result.data;
    return next();
  };
};
