import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  getHeroBannersService,
  createHeroBannerService,
  deleteHeroBannerService,
} from "../services/hero.service";

export const getHeroBannersController = asyncHandler(async (_req: Request, res: Response) => {
  const banners = await getHeroBannersService();
  return res.status(HTTPSTATUS.OK).json({ message: "Hero banners retrieved", banners });
});

export const createHeroBannerController = asyncHandler(async (req: Request, res: Response) => {
  const banner = await createHeroBannerService(req.body);
  return res.status(HTTPSTATUS.CREATED).json({ message: "Hero banner created", banner });
});

export const deleteHeroBannerController = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await deleteHeroBannerService(id);
  return res.status(HTTPSTATUS.OK).json(result);
});
