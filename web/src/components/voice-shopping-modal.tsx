import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Mic, MicOff, Sparkles, Volume2, ShoppingBag, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { parseVoiceCommandMutationFn } from "@/lib/api";
import { useCart } from "@/hooks/use-cart";
import { PUBLIC_ROUTES } from "@/routes/route";
import { toast } from "sonner";

export const VoiceShoppingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  
  const navigate = useNavigate();
  const addToCart = useCart((state) => state.addToCart);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        toast.error("Could not capture voice input. Please try again.");
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  const voiceAiMutation = useMutation({
    mutationFn: parseVoiceCommandMutationFn,
    onSuccess: (data) => {
      const result = data.result;
      setAiFeedback(result.aiResponse);

      if (result.action === "add_to_cart" && result.matchedProduct) {
        const p = result.matchedProduct;
        addToCart({
          productId: p.id,
          imageUrl: p.imageUrl,
          name: p.name,
          salePrice: p.salePrice,
          originalPrice: p.salePrice,
          unit: "item",
        });
        toast.success(`🛒 Added ${p.name} to cart!`);
      } else if (result.action === "search" && result.query) {
        navigate(`${PUBLIC_ROUTES.SEARCH_RESULTS}?q=${encodeURIComponent(result.query)}`);
        setIsOpen(false);
      } else if (result.action === "view_wallet") {
        navigate("/account/wallet");
        setIsOpen(false);
      }
    },
    onError: () => {
      // Fallback to basic search navigation if AI server is offline
      navigate(`${PUBLIC_ROUTES.SEARCH_RESULTS}?q=${encodeURIComponent(transcript)}`);
      setIsOpen(false);
    },
  });

  const handleStartListening = () => {
    if (!recognition) {
      toast.error("Voice input not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }
    setTranscript("");
    setAiFeedback(null);
    setIsOpen(true);
    try {
      recognition.start();
    } catch {
      // Already listening
    }
  };

  const handleStopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleProcessVoiceCommand = () => {
    if (!transcript.trim()) return;
    voiceAiMutation.mutate(transcript.trim());
  };

  return (
    <>
      <button
        type="button"
        onClick={handleStartListening}
        title="Voice Search & AI Assistant"
        className="flex shrink-0 items-center justify-center size-10 rounded-full border border-primary/30 bg-primary/10 text-primary transition hover:bg-primary hover:text-white focus:outline-none"
      >
        <Mic className="size-5" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md text-center p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-xl font-bold">
              <Sparkles className="size-5 text-primary animate-pulse" /> AI Voice Assistant
            </DialogTitle>
          </DialogHeader>

          <div className="py-6 flex flex-col items-center justify-center space-y-5">
            <div className="relative">
              {isListening && (
                <span className="absolute -inset-3 rounded-full bg-primary/20 animate-ping" />
              )}
              <button
                type="button"
                onClick={isListening ? handleStopListening : handleStartListening}
                className={`relative flex size-20 items-center justify-center rounded-full transition-all duration-300 shadow-lg ${
                  isListening
                    ? "bg-destructive text-white scale-110"
                    : "bg-primary text-primary-foreground hover:scale-105"
                }`}
              >
                {isListening ? <Mic className="size-8 animate-bounce" /> : <MicOff className="size-8" />}
              </button>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">
                {isListening ? "Listening... Speak your command now" : "Tap microphone to speak"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Say: <span className="italic font-medium text-foreground">"Add organic apples to cart"</span> or <span className="italic font-medium text-foreground">"Search for dark chocolate"</span>
              </p>
            </div>

            {transcript && (
              <div className="w-full bg-muted/50 p-4 rounded-xl border border-border space-y-2">
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 justify-center">
                  <Volume2 className="size-3 text-primary" /> Spoken Input:
                </p>
                <p className="text-lg font-bold text-foreground capitalize">"{transcript}"</p>
              </div>
            )}

            {aiFeedback && (
              <div className="w-full bg-primary/10 border border-primary/20 p-3 rounded-xl text-primary text-xs font-semibold">
                🤖 AI: {aiFeedback}
              </div>
            )}

            {transcript && (
              <div className="flex gap-3 w-full pt-2">
                <Button variant="outline" className="flex-1" onClick={handleStartListening}>
                  Speak Again
                </Button>
                <Button
                  className="flex-1 gap-2"
                  disabled={voiceAiMutation.isPending}
                  onClick={handleProcessVoiceCommand}
                >
                  {voiceAiMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ShoppingBag className="size-4" />
                  )}
                  Process with AI
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
