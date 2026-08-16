import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  GENERATE_DESCRIPTION_SYSTEM_PROMPT,
  REPHRASE_TITLE_SYSTEM_PROMPT,
} from "./prompt";
import { envConfig } from "../../config/env.config";

export type AIAdminAction = "rephrase-title" | "generate-desc";

export const generateAIAdminContent = async (
  action: AIAdminAction,
  payload: { title?: string; unit?: string; description?: string }
) => {
  const apiKey = envConfig.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const googleProvider = createGoogleGenerativeAI({ apiKey });
      const googleModel = googleProvider("gemini-2.0-flash");
      if (action === "rephrase-title") {
        const { text } = await generateText({
          model: googleModel,
          system: REPHRASE_TITLE_SYSTEM_PROMPT,
          prompt: `Title: ${payload.title ?? ""}\nUnit: ${payload.unit ?? ""}`,
        });
        return { result: text.trim().replace(/^["']|["']$/g, "") };
      }

      if (action === "generate-desc") {
        const { text } = await generateText({
          model: googleModel,
          system: GENERATE_DESCRIPTION_SYSTEM_PROMPT,
          prompt: `Title: ${payload.title ?? ""}\nUnit: ${payload.unit ?? ""}\nExisting description: ${payload.description ?? ""}`,
        });
        return { result: text.trim() };
      }
    } catch (err) {
      console.warn("⚠️ Gemini API call failed, using smart content generator fallback:", err);
    }
  }

  // High quality fallback generator if API key is not configured or network fails
  const rawTitle = payload.title?.trim() || "Fresh Quality Product";
  const unit = payload.unit?.trim() || "pack";

  if (action === "rephrase-title") {
    const formatted = rawTitle
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

    const enhanced = /fresh|organic|premium|gourmet|select|farm/i.test(formatted)
      ? formatted
      : `Organic Premium ${formatted} (${unit})`;

    return { result: enhanced };
  }

  if (action === "generate-desc") {
    const existingDesc = payload.description?.trim();
    if (existingDesc && existingDesc.length > 10) {
      return {
        result: `${existingDesc} Sourced directly from trusted local farms and suppliers, ensuring top-tier freshness, exceptional quality, and unbeatable taste in every single ${unit}.`,
      };
    }
    return {
      result: `Premium quality ${rawTitle.toLowerCase()}, carefully selected and packaged for maximum freshness and flavor. Ideal for daily meals, culinary recipes, and healthy living (${unit}).`,
    };
  }

  throw new Error("Unsupported AI admin action");
};
