import React, { useState } from "react";
import { Mic, Sparkles, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { parseVoiceCommandMutationFn } from "@/lib/api";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

const samplePrompts = [
  "Add organic milk to my cart",
  "Search for fresh red apples",
  "Buy fresh eggs",
];

const VoiceBanner = () => {
  const [activePromptIdx, setActivePromptIdx] = useState(0);
  const addToCart = useCart((state) => state.addToCart);

  const voiceAiMutation = useMutation({
    mutationFn: parseVoiceCommandMutationFn,
    onSuccess: (data) => {
      const result = data.result;
      if (result.action === "add_to_cart" && result.matchedProduct) {
        const p = result.matchedProduct;
        addToCart({
          productId: p.id,
          imageUrl: p.imageUrl || p.images?.[0],
          name: p.name,
          salePrice: p.salePrice,
          originalPrice: p.originalPrice || p.salePrice,
          unit: p.unit || "item",
        });
        toast.success(`CartMind AI: Added ${p.name} to cart!`);
      } else if (result.aiResponse) {
        toast.info(`CartMind AI: ${result.aiResponse}`);
      }
    },
    onError: () => {
      toast.error("Unable to connect to Voice AI backend. Please check network.");
    },
  });

  const handleVoiceCommandTrigger = () => {
    const currentPrompt = samplePrompts[activePromptIdx];
    voiceAiMutation.mutate(currentPrompt);
    // Cycle to next sample prompt
    setActivePromptIdx((prev) => (prev + 1) % samplePrompts.length);
  };

  return (
    <section className="my-6 w-full rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 p-6 md:p-8 text-white shadow-xl border border-emerald-500/30 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-green-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4 max-w-xl">
          <div className="relative flex-shrink-0">
            <button
              onClick={handleVoiceCommandTrigger}
              disabled={voiceAiMutation.isPending}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                voiceAiMutation.isPending
                  ? "bg-amber-500 ring-4 ring-amber-400/40 animate-pulse"
                  : "bg-emerald-500 hover:bg-emerald-400 ring-4 ring-emerald-500/20"
              }`}
              title="Click to process Voice AI command with backend"
            >
              {voiceAiMutation.isPending ? (
                <Loader2 className="w-7 h-7 text-white animate-spin" />
              ) : (
                <Mic className="w-7 h-7 text-white" />
              )}
            </button>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3 h-3" /> Live Backend Gemini Voice AI
              </span>
              {voiceAiMutation.isPending && (
                <span className="text-xs text-amber-400 font-medium animate-pulse">Processing with AI...</span>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Shop 3x Faster with Natural Voice Commands
            </h3>
            <p className="text-slate-300 text-sm mt-1">
              Try prompt: <span className="text-emerald-300 font-semibold italic">&quot;{samplePrompts[activePromptIdx]}&quot;</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Button
            onClick={handleVoiceCommandTrigger}
            disabled={voiceAiMutation.isPending}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {voiceAiMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Connecting to AI...
              </>
            ) : (
              <>
                Run Voice Command <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VoiceBanner;
