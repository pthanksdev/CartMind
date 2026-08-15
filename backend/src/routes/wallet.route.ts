import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import { requireAdmin } from "../middlewares/requireAdmin.middleware";
import {
  getWalletController,
  topupWalletController,
  requestWithdrawalController,
  issueRefundCreditController,
  getAdminPayoutsController,
  approvePayoutController,
} from "../controllers/wallet.controller";

const walletRoutes = Router();

walletRoutes.use(passportAuthenticateJwt);

walletRoutes.get("/", getWalletController);
walletRoutes.post("/topup", topupWalletController);
walletRoutes.post("/withdraw", requestWithdrawalController);

// Admin wallet routes
walletRoutes.get("/admin/payouts", requireAdmin, getAdminPayoutsController);
walletRoutes.put("/admin/payouts/:transactionId/approve", requireAdmin, approvePayoutController);
walletRoutes.post("/admin/refund", requireAdmin, issueRefundCreditController);

export default walletRoutes;
