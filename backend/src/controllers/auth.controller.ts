import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import {
  loginAndMergeGuestCart,
  registerAndMergeGuestCart,
} from "../services/auth.service";
import {
  setJwtAuthCookie,
  clearJwtAuthCookie,
  clearGuestCartCookie,
} from "../utils/cookie.util";
import { USER_ROLES } from "../constants/enums";

const toAuthUser = (user: any) => ({
  _id: String(user.id || user._id),
  id: String(user.id || user._id),
  name: user.name,
  email: user.email,
  avatar: user.avatar ?? null,
  isAdmin: user.role === USER_ROLES.ADMIN || user.role === "admin",
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);
    const guestCartId = req.cookies?.instant_guest_cart_id ?? null;

    const user = await registerAndMergeGuestCart(data, guestCartId);
    const userId = user.id;

    if (guestCartId) clearGuestCartCookie(res);

    return setJwtAuthCookie({ res, userId }).status(HTTPSTATUS.CREATED).json({
      message: "User registered successfully",
      user: toAuthUser(user),
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = loginSchema.parse(req.body);
    const guestCartId = req.cookies?.instant_guest_cart_id ?? null;

    const user = await loginAndMergeGuestCart(
      data.email,
      data.password,
      guestCartId
    );
    const userId = user.id;

    if (guestCartId) clearGuestCartCookie(res);

    return setJwtAuthCookie({ res, userId }).status(HTTPSTATUS.OK).json({
      message: "User logged in successfully",
      user: toAuthUser(user),
    });
  }
);

export const logoutController = asyncHandler(async (_req: Request, res: Response) => {
  return clearJwtAuthCookie(res).status(HTTPSTATUS.OK).json({
    message: "User logged out successfully",
  });
});

export const authStatusController = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  res.status(HTTPSTATUS.OK).json({
    message: "User is authenticated",
    user: user ? toAuthUser(user) : null,
  });
});

export const updateUserProfileController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { updateUserProfileService } = await import("../services/user.service");
  const result = await updateUserProfileService(userId, req.body);

  res.status(HTTPSTATUS.OK).json({
    message: "Profile updated successfully",
    ...result,
  });
});

export const forgotPasswordController = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Email is required" });
    return;
  }

  // Generate 6-digit OTP code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const { sendOtpEmail } = await import("../services/email.service");

  await sendOtpEmail(email, otpCode);

  res.status(HTTPSTATUS.OK).json({
    message: `Verification PIN sent via Gmail SMTP to ${email}`,
    otpCode, // Returned for dev testing, email sent via Gmail SMTP
  });
});
