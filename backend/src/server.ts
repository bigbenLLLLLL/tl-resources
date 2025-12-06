import app from './app.js';
import config from './utils/config.js';
import logger from './utils/logger.js';

const port = config.port;
app.listen(port, () => {
  logger.info({ port }, `Backend listening on http://localhost:${port}`);
});
