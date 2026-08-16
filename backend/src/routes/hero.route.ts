import { Router } from "express";
import {
  getHeroBannersController,
  createHeroBannerController,
  deleteHeroBannerController,
} from "../controllers/hero.controller";
import { passportAuthenticateJwt } from "../config/passport.config";
import { requireAdmin } from "../middlewares/requireAdmin.middleware";

const heroRoutes = Router();

// Public route to fetch active hero slides
heroRoutes.get("/", getHeroBannersController);

// Admin endpoints to manage hero slides
heroRoutes.post("/", passportAuthenticateJwt, requireAdmin, createHeroBannerController);
heroRoutes.delete("/:id", passportAuthenticateJwt, requireAdmin, deleteHeroBannerController);

export default heroRoutes;
