import express from 'express';
import routes from './routes/index';
import { applySecurity } from './middleware/security';
import { applyLogging } from './middleware/logging';
import { applyRateLimit } from './middleware/rateLimit';
import { applyCors } from './middleware/cors';
import { applyParsers } from './middleware/parsers';
import { applyCookies } from './middleware/cookies';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';

const app = express();

// middleware setup (order matters)
applySecurity(app);
applyLogging(app);
applyRateLimit(app);
applyCors(app);
applyParsers(app);
applyCookies(app);

// mount routes
app.use('/api', routes);

// 404 + error handler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
