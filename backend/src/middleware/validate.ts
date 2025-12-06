import { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const error = result.error;
      // return a concise error payload
      return res.status(400).json({ message: 'Invalid request', errors: error.format() });
    }
    // replace body with parsed data
    req.body = result.data;
    return next();
  };
};
