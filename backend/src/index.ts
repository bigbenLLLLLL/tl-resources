import config from './utils/config.js';
import express from 'express';
import routes from './routes/index.js';

import { applySecurity } from './middleware/security.js';
import { applyLogging } from './middleware/logging.js';
import { applyRateLimit } from './middleware/rateLimit.js';
import { applyCors } from './middleware/cors.js';
import { applyParsers } from './middleware/parsers.js';
import { applyCookies } from './middleware/cookies.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';
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

const port = config.port;
app.listen(port, () => {
  logger.info({ port }, `Backend listening on http://localhost:${port}`);
});
