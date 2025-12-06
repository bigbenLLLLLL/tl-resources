import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Compute repo root: backend/src/utils -> backend -> repo root
const backendDir = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(backendDir, '..');

// Only load repo root .env (explicit path). If it doesn't exist, dotenv.config() will no-op.
const dotenvPath = path.join(repoRoot, '.env');
dotenv.config({ path: dotenvPath });

// Determine environment
const NODE_ENV = process.env.NODE_ENV ?? 'development';

function toNumber(value: string | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export const config = {
  nodeEnv: NODE_ENV,
  isProduction: NODE_ENV === 'production',
  port: toNumber(process.env.PORT, 3000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  // JWT settings
  jwtSecret: process.env.JWT_SECRET ?? undefined,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? undefined,
};

export type AppConfig = typeof config;

export default config;
