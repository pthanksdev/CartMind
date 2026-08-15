import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  createCouponService,
  getAllCouponsService,
  toggleCouponStatusService,
  deleteCouponService,
  validateCouponService,
} from "../services/coupon.service";

export const createCouponController = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await createCouponService(req.body);
  return res.status(HTTPSTATUS.CREATED).json({ message: "Coupon created", coupon });
});

export const getAllCouponsController = asyncHandler(async (_req: Request, res: Response) => {
  const coupons = await getAllCouponsService();
  return res.status(HTTPSTATUS.OK).json({ message: "Coupons retrieved", coupons });
});

export const toggleCouponStatusController = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const coupon = await toggleCouponStatusService(id);
  return res.status(HTTPSTATUS.OK).json({ message: "Coupon status updated", coupon });
});

export const deleteCouponController = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await deleteCouponService(id);
  return res.status(HTTPSTATUS.OK).json(result);
});

export const validateCouponController = asyncHandler(async (req: Request, res: Response) => {
  const { code, cartTotal } = req.body;
  const validation = await validateCouponService(code, Number(cartTotal));
  return res.status(HTTPSTATUS.OK).json({ message: "Coupon applied", ...validation });
});
