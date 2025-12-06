import type { Application } from 'express';
import cors from 'cors';

export function applyCors(app: Application) {
  const origin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
  app.use(
    cors({
      origin,
      credentials: true,
    }),
  );
}
