import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye, Star, ExternalLink, PackageCheck, AlertCircle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminProductsQueryFn } from "@/lib/api";

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["admin-products", page, limit],
    queryFn: () => getAdminProductsQueryFn({ page, limit }),
  });

  const products = productsData?.products || [];
  const pagination = productsData?.pagination;
  const totalPages = pagination?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="mt-1 h-4 w-56" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <Card className="border-border">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Product", "Slug", "Original Price", "Discount(%)", "Sale Price", "Stock Count", "Status", "Actions"].map((h) => (
                      <TableHead key={h} className="px-6 py-2">
                        <Skeleton className="h-4 w-24" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j} className="px-6 py-4">
                          <Skeleton className="h-4 w-full max-w-32" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your store catalog and product inventory.</p>
        </div>
        <Button size="lg" className="flex items-center gap-2 px-4!" onClick={() => navigate("/admin/products/new")}>
          <Plus className="h-4 w-4" />
          New Product
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Catalog ({pagination?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-2">Product</TableHead>
                  <TableHead className="px-2 py-2">Slug</TableHead>
                  <TableHead className="px-2 py-2">Original Price</TableHead>
                  <TableHead className="px-2 py-2">Discount(%)</TableHead>
                  <TableHead className="px-2 py-2">Sale Price</TableHead>
                  <TableHead className="px-2 py-2">Stock Count</TableHead>
                  <TableHead className="px-2 py-2">Status</TableHead>
                  <TableHead className="px-2 py-2 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product: any) => {
                    const productId = product.id || product._id;
                    return (
                      <TableRow key={productId} className="hover:bg-muted/30 text-[13px]!">
                        <TableCell className="px-4 py-2">
                          <button
                            type="button"
                            onClick={() => setSelectedProduct(product)}
                            className="flex items-center gap-3 text-left hover:underline group"
                          >
                            <img
                              src={product.images?.[0] || "/placeholder.png"}
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover border group-hover:scale-105 transition-transform"
                            />
                            <div className="flex flex-col">
                              <p className="font-medium truncate max-w-[270px] group-hover:text-primary">{product.name}</p>
                              <span className="text-xs text-muted-foreground">{product.unit || "unit"}</span>
                            </div>
                          </button>
                        </TableCell>
                        <TableCell className="px-2 py-2 text-sm font-mono text-muted-foreground truncate max-w-[170px]">
                          {product.slug}
                        </TableCell>
                        <TableCell className="px-2 py-2 font-medium text-muted-foreground">
                          ${product.originalPrice?.toFixed(2)}
                        </TableCell>
                        <TableCell className="px-2 py-2 font-semibold text-foreground">
                          {product.discountPercent ? `${product.discountPercent}%` : "-"}
                        </TableCell>
                        <TableCell className="px-2 py-2 font-semibold text-foreground">
                          ${product.salePrice?.toFixed(2)}
                        </TableCell>
                        <TableCell className="px-2 py-2">
                          <span className={`font-semibold ${product.stockCount === 0 ? "text-destructive" : "text-foreground"}`}>
                            {product.stockCount}
                          </span>
                        </TableCell>
                        <TableCell className="px-2 py-2">
                          <Badge
                            variant={product.stockCount > 0 ? "default" : "destructive"}
                            className={product.stockCount > 0 ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""}
                          >
                            {product.stockCount > 0 ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-2 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              title="View Details"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <Eye className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Edit Product"
                              onClick={() => navigate(`/admin/products/${productId}/edit`)}
                            >
                              <Edit className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-4 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex-1 text-sm text-muted-foreground">
              Page {pagination?.page || 1} of {totalPages} ({pagination?.total || 0} products)
            </p>
            <Pagination className="flex-1 justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination?.hasPrevPage) setPage(page - 1);
                    }}
                    className={!pagination?.hasPrevPage ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="flex h-9 w-9 items-center justify-center text-sm font-medium">
                    {page}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination?.hasNextPage) setPage(page + 1);
                    }}
                    className={!pagination?.hasNextPage ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Product Quick View Modal for Admin */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center justify-between gap-2 pr-6">
              <span>{selectedProduct?.name}</span>
              <Badge variant={selectedProduct?.stockCount > 0 ? "default" : "destructive"}>
                {selectedProduct?.stockCount > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-3">
                  <div className="aspect-square w-full rounded-lg overflow-hidden border bg-muted">
                    <img
                      src={selectedProduct.images?.[0] || "/placeholder.png"}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedProduct.images?.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.map((img: string, idx: number) => (
                        <div key={idx} className="aspect-square rounded border overflow-hidden">
                          <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/40 border space-y-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-foreground">
                        ${selectedProduct.salePrice?.toFixed(2)}
                      </span>
                      {selectedProduct.originalPrice > selectedProduct.salePrice && (
                        <span className="text-sm line-through text-muted-foreground">
                          ${selectedProduct.originalPrice?.toFixed(2)}
                        </span>
                      )}
                      {selectedProduct.discountPercent > 0 && (
                        <Badge className="bg-destructive text-white">
                          {selectedProduct.discountPercent}% OFF
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Unit: <span className="font-semibold text-foreground">{selectedProduct.unit}</span></p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 border rounded-lg">
                      <span className="text-xs text-muted-foreground block">Inventory Stock</span>
                      <span className="font-bold text-base flex items-center gap-1.5 mt-0.5">
                        {selectedProduct.stockCount > 0 ? (
                          <PackageCheck className="size-4 text-emerald-500" />
                        ) : (
                          <AlertCircle className="size-4 text-destructive" />
                        )}
                        {selectedProduct.stockCount} units available
                      </span>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <span className="text-xs text-muted-foreground block">Rating & Reviews</span>
                      <span className="font-bold text-base flex items-center gap-1 mt-0.5">
                        <Star className="size-4 text-amber-500 fill-amber-500" />
                        {selectedProduct.ratingAverage || "0.0"} ({selectedProduct.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <span className="text-xs text-muted-foreground block font-medium">Category</span>
                    <Badge variant="outline" className="text-xs font-normal">
                      {selectedProduct.category?.name || "General"}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm">
                    <span className="text-xs text-muted-foreground block font-medium">Product Slug</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono block overflow-x-auto">
                      {selectedProduct.slug}
                    </code>
                  </div>
                </div>
              </div>

              {selectedProduct.description && (
                <div className="border-t pt-4 space-y-2">
                  <h4 className="text-sm font-semibold">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {selectedProduct.description}
                  </p>
                </div>
              )}

              <div className="border-t pt-4 flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={`/product/${selectedProduct.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="size-4" />
                    Preview Public Page
                  </a>
                </Button>
                <Button
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => {
                    const id = selectedProduct.id || selectedProduct._id;
                    setSelectedProduct(null);
                    navigate(`/admin/products/${id}/edit`);
                  }}
                >
                  <Edit className="size-4" />
                  Edit Product
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
