import { Router } from "express";
import {
  createProductController,
  getProductByIdController,
  updateProductController,
  generateAIAdminController,
  getAdminAnalyticsController,
  getAdminOrdersController,
  getProductsForAdminController,
  updateOrderStatusController,
  uploadProductImagesController,
  getAdminCustomersController,
  updateProductStockController,
} from "../controllers/admin.controller";
import {
  createCategoryController,
  updateCategoryController,
} from "../controllers/category.controller";
import {
  uploadProductImages,
  validateFilesPresence,
} from "../middlewares/multer.middleware";
import { passportAuthenticateJwt } from "../config/passport.config";
import { requireAdmin } from "../middlewares/requireAdmin.middleware";

const adminRoutes = Router();

adminRoutes.use(passportAuthenticateJwt);
adminRoutes.use(requireAdmin);

adminRoutes.get("/analytics", getAdminAnalyticsController);
adminRoutes.post("/ai/generate", generateAIAdminController);

adminRoutes.get("/orders", getAdminOrdersController);
adminRoutes.put("/orders/:id/status", updateOrderStatusController);

adminRoutes.get("/products", getProductsForAdminController);
adminRoutes.get("/products/:id", getProductByIdController);
adminRoutes.put("/products/:id", updateProductController);
adminRoutes.post(
  "/products/upload",
  uploadProductImages,
  validateFilesPresence,
  uploadProductImagesController
);
adminRoutes.post("/products", createProductController);

adminRoutes.post("/categories", createCategoryController);
adminRoutes.put("/categories/:id", updateCategoryController);

adminRoutes.get("/customers", getAdminCustomersController);
adminRoutes.put("/products/:id/stock", updateProductStockController);

export default adminRoutes;
