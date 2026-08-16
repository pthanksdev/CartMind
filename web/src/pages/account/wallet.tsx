import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWalletQueryFn,
  topupWalletMutationFn,
  requestWithdrawalMutationFn,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/utils/helper";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

const AccountWalletPage = () => {
  const queryClient = useQueryClient();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTopupModal, setShowTopupModal] = useState(false);

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankDetails, setBankDetails] = useState({ bankName: "", accountNumber: "", routingNumber: "" });
  const [topupAmount, setTopupAmount] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-wallet"],
    queryFn: getWalletQueryFn,
  });

  const wallet = data?.wallet || { balance: 0, transactions: [] };

  const topupMutation = useMutation({
    mutationFn: topupWalletMutationFn,
    onSuccess: () => {
      toast.success("Wallet top-up completed successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-wallet"] });
      setShowTopupModal(false);
      setTopupAmount("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to top up wallet");
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: requestWithdrawalMutationFn,
    onSuccess: () => {
      toast.success("Withdrawal request submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-wallet"] });
      setShowWithdrawModal(false);
      setWithdrawAmount("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to request withdrawal");
    },
  });

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid withdrawal amount.");
      return;
    }
    if (amt > wallet.balance) {
      toast.error("Withdrawal amount exceeds your current wallet balance.");
      return;
    }

    const bankStr = `${bankDetails.bankName} - Acct: ${bankDetails.accountNumber}`;
    withdrawMutation.mutate({ amount: amt, bankDetails: bankStr });
  };

  const handleTopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topupAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid deposit amount.");
      return;
    }

    topupMutation.mutate({ amount: amt });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Store Wallet & Refund Credit</h1>
        <p className="text-sm text-muted-foreground">
          Manage your store credits, automatic refund deposits, wallet checkout balance, and bank withdrawals.
        </p>
      </div>

      {/* Main Balance Card */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Wallet className="size-4 text-primary" /> Available Wallet Balance
            </div>
            <p className="text-4xl font-extrabold tracking-tight text-foreground">
              {isLoading ? "Loading..." : formatPrice(wallet.balance)}
            </p>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <ShieldCheck className="size-3.5" /> Ready to use at checkout or withdraw anytime
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => setShowTopupModal(true)} className="gap-2">
              <Plus className="size-4" /> Add Funds
            </Button>
            <Button variant="outline" onClick={() => setShowWithdrawModal(true)} className="gap-2">
              <Building className="size-4" /> Request Withdrawal
            </Button>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <form onSubmit={handleWithdrawSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Building className="size-5 text-primary" /> Withdraw Wallet Funds to Bank
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Withdrawal Amount ($)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                max={wallet.balance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Bank Name</label>
              <Input
                placeholder="e.g. Chase / Bank of America"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Account Number / IBAN</label>
              <Input
                placeholder="Account number"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Routing Number</label>
              <Input
                placeholder="Routing number"
                value={bankDetails.routingNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowWithdrawModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={withdrawMutation.isPending}>
              {withdrawMutation.isPending ? "Submitting..." : "Submit Withdrawal Request"}
            </Button>
          </div>
        </form>
      )}

      {/* Topup Modal */}
      {showTopupModal && (
        <form onSubmit={handleTopupSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Plus className="size-5 text-primary" /> Instant Wallet Top-Up
          </h3>
          <div className="max-w-xs space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Deposit Amount ($)</label>
            <Input
              type="number"
              step="1"
              placeholder="50.00"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowTopupModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={topupMutation.isPending}>
              {topupMutation.isPending ? "Processing..." : "Deposit Funds"}
            </Button>
          </div>
        </form>
      )}

      {/* Transaction History */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Wallet Transaction Log</h3>
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground uppercase">
                <th className="p-4 font-semibold">Transaction Details</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Loading transactions...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-destructive">
                    Failed to load wallet data.
                  </td>
                </tr>
              ) : wallet.transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                wallet.transactions.map((tx: any) => (
                  <tr key={tx.id || tx._id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-full flex items-center justify-center ${
                          tx.amount > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                        }`}>
                          {tx.amount > 0 ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
                        </div>
                        <span>{tx.description}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {tx.status === "completed" || tx.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                          <CheckCircle2 className="size-3" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                          <Clock className="size-3" /> Pending Review
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className={`p-4 text-right font-bold ${tx.amount > 0 ? "text-emerald-600" : "text-foreground"}`}>
                      {tx.amount > 0 ? `+${formatPrice(tx.amount)}` : formatPrice(tx.amount)}
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

export default AccountWalletPage;
