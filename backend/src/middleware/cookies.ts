import type { Application } from 'express';
import cookieParser from 'cookie-parser';

export function applyCookies(app: Application) {
  app.use(cookieParser());
}
