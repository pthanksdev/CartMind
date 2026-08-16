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

import passport from "passport";

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.post("/logout", logoutController);
authRoutes.post("/forgot-password", forgotPasswordController);
authRoutes.get("/status", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
}, authStatusController);
authRoutes.put("/profile", passportAuthenticateJwt, updateUserProfileController);

export default authRoutes;
