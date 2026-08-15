import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  getOrCreateWalletService,
  topupWalletService,
  requestWithdrawalService,
  issueRefundCreditService,
  getAdminPayoutsService,
  approvePayoutService,
} from "../services/wallet.service";

export const getWalletController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const wallet = await getOrCreateWalletService(userId);
  return res.status(HTTPSTATUS.OK).json({ message: "Wallet retrieved", wallet });
});

export const topupWalletController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { amount } = req.body;
  const wallet = await topupWalletService(userId, Number(amount));
  return res.status(HTTPSTATUS.OK).json({ message: "Wallet top-up successful", wallet });
});

export const requestWithdrawalController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { amount, bankDetails } = req.body;
  const wallet = await requestWithdrawalService(userId, Number(amount), bankDetails);
  return res.status(HTTPSTATUS.OK).json({ message: "Withdrawal request submitted", wallet });
});

export const issueRefundCreditController = asyncHandler(async (req: Request, res: Response) => {
  const { customerEmail, amount, note } = req.body;
  const wallet = await issueRefundCreditService(customerEmail, Number(amount), note);
  return res.status(HTTPSTATUS.OK).json({ message: "Store credit issued successfully", wallet });
});

export const getAdminPayoutsController = asyncHandler(async (req: Request, res: Response) => {
  const payouts = await getAdminPayoutsService();
  return res.status(HTTPSTATUS.OK).json({ message: "Payout requests retrieved", payouts });
});

export const approvePayoutController = asyncHandler(async (req: Request, res: Response) => {
  const transactionId = req.params.transactionId as string;
  const payout = await approvePayoutService(transactionId);
  return res.status(HTTPSTATUS.OK).json({ message: "Payout approved successfully", payout });
});
