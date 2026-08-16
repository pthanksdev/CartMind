import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminPayoutsQueryFn,
  approvePayoutMutationFn,
  issueRefundCreditMutationFn,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/utils/helper";
import {
  Wallet,
  CheckCircle2,
  Clock,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";

const AdminWalletPage = () => {
  const queryClient = useQueryClient();
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundData, setRefundData] = useState({ customerEmail: "", amount: "", note: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-payouts"],
    queryFn: getAdminPayoutsQueryFn,
  });

  const payouts = data?.payouts || [];

  const approvePayoutMutation = useMutation({
    mutationFn: approvePayoutMutationFn,
    onSuccess: () => {
      toast.success("Withdrawal payout approved!");
      queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to approve payout");
    },
  });

  const refundMutation = useMutation({
    mutationFn: issueRefundCreditMutationFn,
    onSuccess: (_, variables) => {
      toast.success(`Issued ${formatPrice(variables.amount)} store credit to ${variables.customerEmail}!`);
      setShowRefundModal(false);
      setRefundData({ customerEmail: "", amount: "", note: "" });
      queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to issue credit refund");
    },
  });

  const handleApprovePayout = (transactionId: string) => {
    approvePayoutMutation.mutate(transactionId);
  };

  const handleIssueRefundCredit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundData.customerEmail || !refundData.amount) {
      toast.error("Please fill in customer email and amount.");
      return;
    }

    refundMutation.mutate({
      customerEmail: refundData.customerEmail,
      amount: Number(refundData.amount),
      note: refundData.note,
    });
  };

  const pendingCount = payouts.filter((p: any) => p.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Store Wallet & Payout Operations
          </h1>
          <p className="text-sm text-muted-foreground">
            Approve customer bank withdrawal payouts and issue store credit refunds directly to customer wallets.
          </p>
        </div>
        <Button onClick={() => setShowRefundModal(true)} className="gap-2">
          <PlusCircle className="size-4" /> Issue Credit Refund
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wallet className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Withdrawal Requests</p>
            <p className="text-2xl font-bold text-foreground">{payouts.length}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <Clock className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Pending Payout Requests</p>
            <p className="text-2xl font-bold text-amber-600">{pendingCount} requests</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Approved Payouts</p>
            <p className="text-2xl font-bold text-emerald-600">
              {payouts.filter((p: any) => p.status === "approved").length}
            </p>
          </div>
        </div>
      </div>

      {/* Credit Refund Modal */}
      {showRefundModal && (
        <form onSubmit={handleIssueRefundCredit} className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <PlusCircle className="size-5 text-primary" /> Issue Direct Store Credit / Refund
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Customer Email *</label>
              <Input
                type="email"
                placeholder="customer@example.com"
                value={refundData.customerEmail}
                onChange={(e) => setRefundData({ ...refundData, customerEmail: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Credit Amount ($) *</label>
              <Input
                type="number"
                step="0.01"
                placeholder="25.00"
                value={refundData.amount}
                onChange={(e) => setRefundData({ ...refundData, amount: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Reason / Note</label>
              <Input
                placeholder="Order #84920 Refund"
                value={refundData.note}
                onChange={(e) => setRefundData({ ...refundData, note: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowRefundModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={refundMutation.isPending}>
              {refundMutation.isPending ? "Issuing..." : "Deposit Credit to Wallet"}
            </Button>
          </div>
        </form>
      )}

      {/* Payout Requests Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Bank Withdrawal & Payout Requests</h3>
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground uppercase">
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Bank & Account Details</th>
                <th className="p-4 font-semibold">Date Requested</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Amount</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Loading payout requests...
                  </td>
                </tr>
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No withdrawal payout requests submitted yet.
                  </td>
                </tr>
              ) : (
                payouts.map((payout: any) => (
                  <tr key={payout.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-foreground">{payout.wallet?.user?.name || "Customer"}</p>
                      <p className="text-xs text-muted-foreground">{payout.wallet?.user?.email}</p>
                    </td>
                    <td className="p-4 text-xs">
                      <p className="font-medium text-foreground">{payout.bankDetails || "Bank Account"}</p>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      {payout.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                          <CheckCircle2 className="size-3" /> Processed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                          <Clock className="size-3" /> Pending Review
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right font-bold text-foreground">
                      {formatPrice(Math.abs(payout.amount))}
                    </td>
                    <td className="p-4 text-right">
                      {payout.status === "pending" && (
                        <Button
                          size="sm"
                          disabled={approvePayoutMutation.isPending}
                          onClick={() => handleApprovePayout(payout.id)}
                        >
                          Approve Payout
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminWalletPage;
