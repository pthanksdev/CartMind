import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const queryClient = useQueryClient();

  useEffect(() => {
    // Invalidate cart and orders to ensure fresh data after checkout
    queryClient.invalidateQueries({ queryKey: ["cart"] });
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  }, [queryClient]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 grid size-20 place-items-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500">
        <CheckCircle2 className="size-10" />
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
        Order Confirmed!
      </h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        Thank you for your purchase. We have received your order and will email you a confirmation and tracking link once it ships.
      </p>
      
      {sessionId && (
        <p className="mb-6 text-sm text-muted-foreground">
          Reference: <span className="font-medium text-foreground">{sessionId.substring(0, 15)}...</span>
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild size="lg">
          <Link to="/orders">View my orders</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/products">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
