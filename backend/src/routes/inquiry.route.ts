import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import { requireAdmin } from "../middlewares/requireAdmin.middleware";
import {
  createInquiryController,
  getAllInquiriesController,
  resolveInquiryController,
} from "../controllers/inquiry.controller";

const inquiryRoutes = Router();

// Public submission
inquiryRoutes.post("/", createInquiryController);

// Admin endpoints
inquiryRoutes.get("/", passportAuthenticateJwt, requireAdmin, getAllInquiriesController);
inquiryRoutes.put("/:id/resolve", passportAuthenticateJwt, requireAdmin, resolveInquiryController);

export default inquiryRoutes;
