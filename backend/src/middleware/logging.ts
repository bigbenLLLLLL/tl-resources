import type { Application } from 'express';
import morgan from 'morgan';
import pinoHttp from 'pino-http';
import logger from '../utils/logger.js';

export function applyLogging(app: Application) {
  if (process.env.NODE_ENV === 'production') {
    // in production prefer structured logger (pino) via pino-http
    app.use(pinoHttp({ logger }));
  } else {
    app.use(morgan('dev'));
  }
}
