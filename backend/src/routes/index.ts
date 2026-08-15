import { Router } from "express";
import authRoute from "./auth.route";
import productRoute from "./product.route";
import adminRoute from "./admin.route";
import categoryRoute from "./category.route";
import cartRoute from "./cart.route";
import addressRoute from "./address.route";
import orderRoute from "./order.route";
import reviewRoute from "./review.route";
import walletRoute from "./wallet.route";
import couponRoute from "./coupon.route";
import settingRoute from "./setting.route";
import inquiryRoute from "./inquiry.route";
import voiceRoute from "./voice.route";

const router = Router();

router.use("/auth", authRoute);
router.use("/products", productRoute);
router.use("/admin", adminRoute);
router.use("/categories", categoryRoute);
router.use("/cart", cartRoute);
router.use("/addresses", addressRoute);
router.use("/orders", orderRoute);
router.use("/reviews", reviewRoute);
router.use("/wallet", walletRoute);
router.use("/coupons", couponRoute);
router.use("/settings", settingRoute);
router.use("/inquiries", inquiryRoute);
router.use("/voice", voiceRoute);

export default router;