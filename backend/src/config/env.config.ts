export const envConfig = {
  get NODE_ENV() {
    return process.env.NODE_ENV || "development";
  },
  get PORT() {
    return process.env.PORT || "10000";
  },
  get DATABASE_URL() {
    return (
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/ecommerce_db?schema=public"
    );
  },
  get JWT_SECRET() {
    return process.env.JWT_SECRET || "super_secret_jwt_key_cartmind_2026";
  },
  get JWT_EXPIRES_IN() {
    return process.env.JWT_EXPIRES_IN || "7d";
  },
  get STRIPE_SECRET_KEY() {
    return process.env.STRIPE_SECRET_KEY || "";
  },
  get STRIPE_WEBHOOK_SECRET() {
    return process.env.STRIPE_WEBHOOK_SECRET || "";
  },
  get CLOUDINARY_CLOUD_NAME() {
    return process.env.CLOUDINARY_CLOUD_NAME || "";
  },
  get CLOUDINARY_API_KEY() {
    return process.env.CLOUDINARY_API_KEY || "";
  },
  get CLOUDINARY_API_SECRET() {
    return process.env.CLOUDINARY_API_SECRET || "";
  },
  get FRONTEND_ORIGIN() {
    return process.env.FRONTEND_ORIGIN || "http://localhost:5173";
  },
};
