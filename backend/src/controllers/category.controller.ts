import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  getCategoriesService,
  createCategoryService,
  updateCategoryService,
} from "../services/category.service";

export const getCategoriesController = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await getCategoriesService();

    res.status(HTTPSTATUS.OK).json({
      message: "Categories retrieved successfully",
      ...result,
    });
  }
);

export const createCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await createCategoryService(req.body);

    res.status(HTTPSTATUS.CREATED).json({
      message: "Category created successfully",
      ...result,
    });
  }
);

export const updateCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await updateCategoryService(id, req.body);

    res.status(HTTPSTATUS.OK).json({
      message: "Category updated successfully",
      ...result,
    });
  }
);
