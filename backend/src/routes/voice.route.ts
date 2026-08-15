import { Router } from "express";
import { parseVoiceCommandController } from "../controllers/voice.controller";

const voiceRoutes = Router();

// Public / Mobile voice command parsing route
voiceRoutes.post("/parse", parseVoiceCommandController);

export default voiceRoutes;
