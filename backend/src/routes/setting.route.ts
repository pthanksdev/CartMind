import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import { requireAdmin } from "../middlewares/requireAdmin.middleware";
import {
  getStoreSettingsController,
  updateStoreSettingsController,
} from "../controllers/setting.controller";

const settingRoutes = Router();

settingRoutes.get("/", getStoreSettingsController);

// Admin update settings
settingRoutes.put("/", passportAuthenticateJwt, requireAdmin, updateStoreSettingsController);

export default settingRoutes;
