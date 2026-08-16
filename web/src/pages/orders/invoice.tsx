import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrderByIdQueryFn } from "@/lib/api";
import { formatPrice } from "@/utils/helper";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft, CheckCircle2 } from "lucide-react";
import logoImg from "@/assets/logo.png";

const OrderInvoicePage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order-invoice", orderId],
    queryFn: () => getOrderByIdQueryFn(orderId!),
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError || !data?.order) {
    return (
      <div className="container max-w-xl py-16 text-center">
        <h2 className="text-xl font-bold text-destructive">Invoice Not Found</h2>
        <p className="mt-2 text-muted-foreground">We couldn't retrieve the invoice for this order.</p>
        <Button asChild className="mt-6">
          <Link to="/account/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const order = data.order;
  const createdDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background py-8">
      {/* Top Action Bar (hidden on print) */}
      <div className="container max-w-4xl mb-6 flex items-center justify-between print:hidden">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/orders/${order._id}`}>
            <ArrowLeft className="mr-2 size-4" /> Back to Order Details
          </Link>
        </Button>
        <Button onClick={() => window.print()} className="gap-2">
          <Printer className="size-4" /> Print Invoice / Save PDF
        </Button>
      </div>

      {/* Invoice Card */}
      <div className="container max-w-4xl rounded-2xl border border-border bg-card p-8 shadow-sm print:border-none print:shadow-none print:p-0">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between border-b border-border pb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src={logoImg} alt="StoreFast Logo" className="h-8 w-auto object-contain" />
              <span className="text-xl font-bold tracking-tight">StoreFast</span>
            </div>
            <p className="text-xs text-muted-foreground">Official Sales Receipt & Invoice</p>
            <p className="text-xs text-muted-foreground mt-1">support@storefast.com | +1 (800) 555-0199</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
              INVOICE #{order.orderNo || order._id.slice(-8).toUpperCase()}
            </span>
            <p className="text-sm text-muted-foreground">
              Date: <span className="font-medium text-foreground">{createdDate}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Payment Status:{" "}
              <span className="font-semibold text-emerald-600 capitalize">{order.paymentStatus}</span>
            </p>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="grid sm:grid-cols-2 gap-6 py-6 border-b border-border text-sm">
          <div>
            <h4 className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Billed & Shipped To
            </h4>
            <p className="font-medium text-foreground">{order.shippingAddress?.recipientName}</p>
            <p className="text-muted-foreground">{order.shippingAddress?.street}</p>
            <p className="text-muted-foreground">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
            </p>
            <p className="text-muted-foreground">Phone: {order.shippingAddress?.phone}</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Order Information
            </h4>
            <p className="text-muted-foreground">
              Order Reference ID: <span className="font-mono text-foreground font-medium">{order._id}</span>
            </p>
            <p className="text-muted-foreground">
              Fulfillment Status:{" "}
              <span className="capitalize font-medium text-foreground">{order.status}</span>
            </p>
            <p className="text-muted-foreground">
              Payment Method: <span className="capitalize font-medium text-foreground">{order.paymentMethod}</span>
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-6">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase">
                <th className="py-3">Item Description</th>
                <th className="py-3 text-center">Unit Price</th>
                <th className="py-3 text-center">Qty</th>
                <th className="py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {order.items.map((item: any) => (
                <tr key={item.id}>
                  <td className="py-3">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Unit: {item.unit}</p>
                  </td>
                  <td className="py-3 text-center">{formatPrice(item.salePrice)}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right font-medium">{formatPrice(item.salePrice * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Summary Totals */}
        <div className="flex justify-end border-t border-border pt-6">
          <div className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Estimated Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping / Delivery</span>
              <span>{order.deliveryFee === 0 ? "FREE" : formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-foreground">
              <span>Total Paid</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 border-t border-border/80 pt-6 text-center text-xs text-muted-foreground">
          <p className="flex items-center justify-center gap-1 font-medium text-foreground">
            <CheckCircle2 className="size-4 text-emerald-500" /> Thank you for shopping with StoreFast!
          </p>
          <p className="mt-1">
            If you have any questions regarding this order invoice, please contact support@storefast.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderInvoicePage;
