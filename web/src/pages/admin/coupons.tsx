import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCouponsQueryFn,
  createCouponMutationFn,
  toggleCouponStatusMutationFn,
  deleteCouponMutationFn,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Ticket,
  Plus,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

const AdminCouponsPage = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: getCouponsQueryFn,
  });

  const coupons = data?.coupons || [];

  const createCouponMutation = useMutation({
    mutationFn: createCouponMutationFn,
    onSuccess: (data) => {
      toast.success(`Coupon code ${data.coupon.code} created successfully!`);
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setIsCreating(false);
      setNewCoupon({
        code: "",
        type: "percentage",
        discountValue: 10,
        minSpend: 0,
        maxUsage: 100,
        expiresAt: "2026-12-31",
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create coupon");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: toggleCouponStatusMutationFn,
    onSuccess: () => {
      toast.success("Coupon status updated!");
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
  });

  const deleteCouponMutation = useMutation({
    mutationFn: deleteCouponMutationFn,
    onSuccess: () => {
      toast.success("Coupon deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
  });

  const [newCoupon, setNewCoupon] = useState<{
    code: string;
    type: "percentage" | "fixed";
    discountValue: number;
    minSpend: number;
    maxUsage: number;
    expiresAt: string;
  }>({
    code: "",
    type: "percentage",
    discountValue: 10,
    minSpend: 0,
    maxUsage: 100,
    expiresAt: "2026-12-31",
  });

  const handleToggleActive = (id: string) => {
    toggleStatusMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteCouponMutation.mutate(id);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied code "${code}" to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) {
      toast.error("Please enter a coupon code");
      return;
    }

    createCouponMutation.mutate(newCoupon);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Coupon & Discount Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and manage promotional discount vouchers, redemption limits, and active campaigns.
          </p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
          <Plus className="size-4" /> {isCreating ? "Cancel" : "Create New Coupon"}
        </Button>
      </div>

      {/* Create Coupon Modal/Box */}
      {isCreating && (
        <form
          onSubmit={handleCreateCoupon}
          className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-sm space-y-4"
        >
          <h3 className="text-base font-bold flex items-center gap-2">
            <Ticket className="size-5 text-primary" /> Create New Promo Code
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Coupon Code *</label>
              <Input
                placeholder="e.g. SUMMER15"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Discount Type</label>
              <select
                value={newCoupon.type}
                onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as any })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Discount Value *</label>
              <Input
                type="number"
                step="0.5"
                value={newCoupon.discountValue}
                onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Min Order Spend ($)</label>
              <Input
                type="number"
                value={newCoupon.minSpend}
                onChange={(e) => setNewCoupon({ ...newCoupon, minSpend: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Max Redemptions Limit</label>
              <Input
                type="number"
                value={newCoupon.maxUsage}
                onChange={(e) => setNewCoupon({ ...newCoupon, maxUsage: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Expiration Date</label>
              <Input
                type="date"
                value={newCoupon.expiresAt}
                onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createCouponMutation.isPending}>
              {createCouponMutation.isPending ? "Creating..." : "Save Coupon"}
            </Button>
          </div>
        </form>
      )}

      {/* Coupons Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground uppercase">
              <th className="p-4 font-semibold">Promo Code</th>
              <th className="p-4 font-semibold">Discount</th>
              <th className="p-4 font-semibold">Min Spend</th>
              <th className="p-4 font-semibold text-center">Redemptions</th>
              <th className="p-4 font-semibold">Expires</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  Loading coupons...
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  No coupons found. Click "Create New Coupon" above.
                </td>
              </tr>
            ) : (
              coupons.map((coupon: any) => (
                <tr key={coupon.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-mono font-bold">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className="text-muted-foreground hover:text-foreground"
                        title="Copy code"
                      >
                        {copiedCode === coupon.code ? (
                          <Check className="size-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-emerald-600">
                    {coupon.type === "percentage" ? `${coupon.discountValue}% OFF` : `$${coupon.discountValue} OFF`}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {coupon.minSpend > 0 ? `$${coupon.minSpend}` : "None"}
                  </td>
                  <td className="p-4 text-center text-xs">
                    <span className="font-semibold text-foreground">{coupon.usageCount}</span> / {coupon.maxUsage}
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {new Date(coupon.expiresAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <Switch
                      checked={coupon.isActive}
                      onCheckedChange={() => handleToggleActive(coupon.id)}
                    />
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(coupon.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCouponsPage;
