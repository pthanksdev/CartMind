import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInquiriesQueryFn, resolveInquiryMutationFn } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Mail } from "lucide-react";
import { toast } from "sonner";

const AdminInquiriesPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: getInquiriesQueryFn,
  });

  const inquiries = data?.inquiries || [];

  const resolveMutation = useMutation({
    mutationFn: resolveInquiryMutationFn,
    onSuccess: () => {
      toast.success("Inquiry marked as resolved!");
      queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to resolve inquiry");
    },
  });

  const handleResolve = (id: string) => {
    resolveMutation.mutate(id);
  };

  const pendingCount = inquiries.filter((i: any) => i.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customer Support Inbox</h1>
        <p className="text-sm text-muted-foreground">
          View inquiries submitted by customers from the Help Center and mark support tickets as resolved.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <Clock className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Pending Tickets</p>
            <p className="text-2xl font-bold text-amber-600">{pendingCount} messages</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Resolved Tickets</p>
            <p className="text-2xl font-bold text-emerald-600">
              {inquiries.filter((i: any) => i.status === "resolved").length}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground uppercase">
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Subject</th>
              <th className="p-4 font-semibold">Message</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  Loading inquiries...
                </td>
              </tr>
            ) : inquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No support messages submitted yet.
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry: any) => (
                <tr key={inquiry.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-foreground">{inquiry.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="size-3" /> {inquiry.email}
                    </p>
                  </td>
                  <td className="p-4 font-medium text-foreground max-w-[160px] truncate">
                    {inquiry.subject || "No Subject"}
                  </td>
                  <td className="p-4 text-xs text-muted-foreground max-w-[260px]">
                    <p className="line-clamp-2">{inquiry.message}</p>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    {inquiry.status === "resolved" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                        <CheckCircle2 className="size-3" /> Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                        <Clock className="size-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {inquiry.status === "pending" && (
                      <Button
                        size="sm"
                        disabled={resolveMutation.isPending}
                        onClick={() => handleResolve(inquiry.id)}
                      >
                        Mark Resolved
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
  );
};

export default AdminInquiriesPage;
