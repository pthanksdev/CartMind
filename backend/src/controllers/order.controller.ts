import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { createOrderSchema, getUserOrderByIdSchema } from "../validators/order.validator";
import {
  createOrderService,
  getUserOrdersService,
  getUserOrderByIdService,
} from "../services/order.service";
import { sendOrderConfirmationEmail } from "../services/email.service";

export const createOrderController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const userEmail = req.user!.email;
    const data = createOrderSchema.parse(req.body);
    const result = await createOrderService(userId, data);

    // Send Order Receipt Email via Gmail SMTP
    if (userEmail && result.order) {
      sendOrderConfirmationEmail(userEmail, result.order).catch((err) =>
        console.error("Order email error:", err)
      );
    }

    res.status(HTTPSTATUS.CREATED).json({
      message: "Order created successfully",
      ...result,
    });
  }
);

export const getUserOrdersController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await getUserOrdersService(userId);

    res.status(HTTPSTATUS.OK).json({
      message: "Orders retrieved successfully",
      ...result,
    });
  }
);

export const getUserOrderByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = getUserOrderByIdSchema.parse({ id: req.params.id });
    const result = await getUserOrderByIdService(userId, id);

    res.status(HTTPSTATUS.OK).json({
      message: "Order retrieved successfully",
      ...result,
    });
  }
);
