import type { Application } from 'express';
import helmet from 'helmet';

export function applySecurity(app: Application) {
  // sensible defaults; customize CSP or other headers as needed
  app.use(helmet());
}
