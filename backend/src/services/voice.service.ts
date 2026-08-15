import { generateText } from "ai";
import { prisma } from "../config/database.config";

export const parseVoiceCommandService = async (spokenText: string) => {
  if (!spokenText || !spokenText.trim()) {
    return {
      action: "unknown",
      aiResponse: "I didn't hear anything. Please try speaking again.",
    };
  }

  // Fetch recent active products for keyword matching
  const activeProducts = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, name: true, salePrice: true, slug: true, images: true },
    take: 50,
  });

  const productContext = activeProducts
    .map((p) => `ID: ${p.id} | Name: ${p.name} | Price: $${p.salePrice}`)
    .join("\n");

  const systemPrompt = `You are a smart e-commerce voice assistant for an online store.
Analyze the user's spoken voice command and return a structured JSON response.

Available Actions:
1. "search": user wants to search or find items (e.g. "search for apples", "where is milk").
2. "add_to_cart": user wants to buy or add items to cart (e.g. "buy 2 milks", "add organic eggs").
3. "view_wallet": user asks about wallet balance or refunds.
4. "help": user asks for help or support.

Catalog Context:
${productContext}

OUTPUT FORMAT (Respond STRICTLY with valid JSON, no markdown wrappers):
{
  "action": "search" | "add_to_cart" | "view_wallet" | "help",
  "query": "extracted search keywords or product name",
  "quantity": 1,
  "matchedProductId": "product ID if matched or null",
  "aiResponse": "Friendly spoken confirmation message for the user"
}`;

  try {
    const { text } = await generateText({
      model: "google/gemini-2.5-flash-lite",
      system: systemPrompt,
      prompt: `User Spoken Command: "${spokenText}"`,
    });

    const cleanJsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanJsonStr);

    let matchedProduct = null;
    if (parsed.matchedProductId) {
      const found = activeProducts.find((p) => p.id === parsed.matchedProductId);
      if (found) {
        matchedProduct = {
          ...found,
          imageUrl: found.images[0] || "",
        };
      }
    } else if (parsed.query) {
      const lowerQuery = parsed.query.toLowerCase();
      const found = activeProducts.find((p) =>
        p.name.toLowerCase().includes(lowerQuery)
      );
      if (found) {
        matchedProduct = {
          ...found,
          imageUrl: found.images[0] || "",
        };
      }
    }

    return {
      ...parsed,
      matchedProduct,
    };
  } catch (error) {
    console.error("AI Voice parsing error:", error);
    return {
      action: "search",
      query: spokenText,
      aiResponse: `Searching store for "${spokenText}"`,
    };
  }
};
