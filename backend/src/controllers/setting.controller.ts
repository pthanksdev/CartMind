import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getStoreSettingsService, updateStoreSettingsService } from "../services/setting.service";

export const getStoreSettingsController = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await getStoreSettingsService();
  return res.status(HTTPSTATUS.OK).json({ message: "Store settings retrieved", settings });
});

export const updateStoreSettingsController = asyncHandler(async (req: Request, res: Response) => {
  const settings = await updateStoreSettingsService(req.body);
  return res.status(HTTPSTATUS.OK).json({ message: "Store settings updated", settings });
});
