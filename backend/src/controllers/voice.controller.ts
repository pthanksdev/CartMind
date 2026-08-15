import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { parseVoiceCommandService } from "../services/voice.service";

export const parseVoiceCommandController = asyncHandler(async (req: Request, res: Response) => {
  const { command } = req.body;
  const result = await parseVoiceCommandService(command);

  return res.status(HTTPSTATUS.OK).json({
    message: "Voice command processed successfully",
    result,
  });
});
