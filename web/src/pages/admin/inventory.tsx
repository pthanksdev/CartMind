import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductsQueryFn, updateProductStockMutationFn } from "@/lib/api";
import { formatPrice } from "@/utils/helper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  PackageX,
  Save,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
} from "lucide-react";
import { toast } from "sonner";

const AdminInventoryPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: () => getProductsQueryFn({ limit: 100 }),
  });

  const updateStockMutation = useMutation({
    mutationFn: updateProductStockMutationFn,
    onSuccess: (_, variables) => {
      toast.success("Stock count updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setStockEdits((prev) => {
        const next = { ...prev };
        delete next[variables.id];
        return next;
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update stock");
    },
  });

  const products = data?.products || [];

  const lowStockProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStockInputChange = (productId: string, val: string) => {
    const num = parseInt(val, 10);
    setStockEdits((prev) => ({
      ...prev,
      [productId]: isNaN(num) ? 0 : num,
    }));
  };

  const handleSaveStock = (productId: string) => {
    const stockCount = stockEdits[productId];
    if (stockCount === undefined) return;
    updateStockMutation.mutate({ id: productId, stockCount });
  };

  const outOfStockCount = products.filter((p: any) => p.stockCount <= 0).length;
  const lowStockCount = products.filter((p: any) => p.stockCount > 0 && p.stockCount <= 10).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Inventory & Stock Monitor
          </h1>
          <p className="text-sm text-muted-foreground">
            Track product stock levels, receive out-of-stock alerts, and perform instant inline restocks.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="size-4" /> Refresh Inventory
        </Button>
      </div>

      {/* Metrics Banner */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <PackageX className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Out of Stock</p>
            <p className="text-2xl font-bold text-destructive">{outOfStockCount} items</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <AlertTriangle className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Low Stock (&le; 10)</p>
            <p className="text-2xl font-bold text-amber-600">{lowStockCount} items</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Tracked Products</p>
            <p className="text-2xl font-bold text-foreground">{products.length} items</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Filter catalog by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Stock Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground uppercase">
              <th className="p-4 font-semibold">Product Info</th>
              <th className="p-4 font-semibold">Unit Price</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-center w-40">Current Stock</th>
              <th className="p-4 font-semibold text-right">Quick Restock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  Loading inventory status...
                </td>
              </tr>
            ) : lowStockProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No products found.
                </td>
              </tr>
            ) : (
              lowStockProducts.map((product: any) => {
                const currentEditStock =
                  stockEdits[product._id] !== undefined
                    ? stockEdits[product._id]
                    : product.stockCount;
                const isChanged =
                  stockEdits[product._id] !== undefined &&
                  stockEdits[product._id] !== product.stockCount;

                return (
                  <tr key={product._id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="size-10 object-contain rounded-md bg-muted/20 p-1"
                        />
                        <div>
                          <p className="font-semibold text-foreground line-clamp-1">{product.name}</p>
                          <p className="text-xs text-muted-foreground">Unit: {product.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-foreground">
                      {formatPrice(product.salePrice)}
                    </td>
                    <td className="p-4 text-center">
                      {product.stockCount <= 0 ? (
                        <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                          Out of Stock
                        </span>
                      ) : product.stockCount <= 10 ? (
                        <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                          Low Stock
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <Input
                        type="number"
                        min={0}
                        value={currentEditStock}
                        onChange={(e) => handleStockInputChange(product._id, e.target.value)}
                        className="w-24 text-center mx-auto"
                      />
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        disabled={!isChanged || updateStockMutation.isPending}
                        onClick={() => handleSaveStock(product._id)}
                        className="gap-1.5"
                      >
                        <Save className="size-3.5" /> Update
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventoryPage;
