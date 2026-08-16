import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import { requireAdmin } from "../middlewares/requireAdmin.middleware";
import {
  createCouponController,
  getAllCouponsController,
  getActiveCouponsController,
  toggleCouponStatusController,
  deleteCouponController,
  validateCouponController,
} from "../controllers/coupon.controller";

const couponRoutes = Router();

couponRoutes.get("/active", getActiveCouponsController);
couponRoutes.post("/validate", validateCouponController);

// Admin endpoints
couponRoutes.use(passportAuthenticateJwt);
couponRoutes.use(requireAdmin);

couponRoutes.get("/", getAllCouponsController);
couponRoutes.post("/", createCouponController);
couponRoutes.put("/:id/toggle", toggleCouponStatusController);
couponRoutes.delete("/:id", deleteCouponController);

export default couponRoutes;
