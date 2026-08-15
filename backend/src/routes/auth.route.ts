import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  authStatusController,
  updateUserProfileController,
  forgotPasswordController,
} from "../controllers/auth.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.post("/logout", logoutController);
authRoutes.post("/forgot-password", forgotPasswordController);
authRoutes.get("/status", passportAuthenticateJwt, authStatusController);
authRoutes.put("/profile", passportAuthenticateJwt, updateUserProfileController);

export default authRoutes;
