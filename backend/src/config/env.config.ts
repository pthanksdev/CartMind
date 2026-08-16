import { getEnv } from "../utils/get-env.util";

export const envConfig = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "5000"),
  DATABASE_URL: getEnv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/ecommerce_db?schema=public"),

  JWT_SECRET: getEnv("JWT_SECRET", "super_secret_jwt_key_cartmind_2026"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "7d"),

  STRIPE_SECRET_KEY: getEnv("STRIPE_SECRET_KEY", ""),
  STRIPE_WEBHOOK_SECRET: getEnv("STRIPE_WEBHOOK_SECRET", ""),

  CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME", ""),
  CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY", ""),
  CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET", ""),
  
  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "http://localhost:5173"),
};
