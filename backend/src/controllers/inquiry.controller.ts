import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  createInquiryService,
  getAllInquiriesService,
  resolveInquiryService,
} from "../services/inquiry.service";

export const createInquiryController = asyncHandler(async (req: Request, res: Response) => {
  const inquiry = await createInquiryService(req.body);
  return res.status(HTTPSTATUS.CREATED).json({ message: "Inquiry submitted successfully", inquiry });
});

export const getAllInquiriesController = asyncHandler(async (_req: Request, res: Response) => {
  const inquiries = await getAllInquiriesService();
  return res.status(HTTPSTATUS.OK).json({ message: "Inquiries retrieved", inquiries });
});

export const resolveInquiryController = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const inquiry = await resolveInquiryService(id);
  return res.status(HTTPSTATUS.OK).json({ message: "Inquiry resolved", inquiry });
});
