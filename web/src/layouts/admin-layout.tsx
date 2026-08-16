import { Link, Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, ArrowLeft, LogOut, FolderTree, Users, Boxes, Ticket, Settings, Wallet, HelpCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { logoutMutationFn } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PROTECTED_ROUTES } from "@/routes/route";
import { useUser } from "@/hooks/use-user";

const adminNavItems = [
  {
    label: "Dashboard",
    to: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Orders",
    to: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Products",
    to: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    to: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Customers",
    to: "/admin/customers",
    icon: Users,
  },
  {
    label: "Inventory",
    to: "/admin/inventory",
    icon: Boxes,
  },
  {
    label: "Store Wallet & Payouts",
    to: "/admin/wallet",
    icon: Wallet,
  },
  {
    label: "Support Inbox",
    to: "/admin/inquiries",
    icon: HelpCircle,
  },
  {
    label: "Coupons",
    to: "/admin/coupons",
    icon: Ticket,
  },
  {
    label: "Store Settings",
    to: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout() {
  const { data: user, isLoading } = useUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      queryClient.setQueryData(["current-user"], null);
      queryClient.removeQueries({ queryKey: ["current-user"] });
      toast.success("Logged out successfully");
      navigate("/");
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
        <Logo />
        <Spinner className="size-8" />
      </div>
    );
  }

  // Enforce strict admin role check
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "18rem" } as React.CSSProperties}>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="flex h-16 items-center border-b border-border/10 px-5">
            <Link to={PROTECTED_ROUTES.ADMIN_DASHBOARD} className="flex items-center gap-3 font-semibold">
              <Logo to={PROTECTED_ROUTES.ADMIN_DASHBOARD} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded-md">Admin</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-3.5 py-4">
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                <SidebarMenu className="gap-1.5">
                  {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.to === pathname;
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton 
                          asChild
                          isActive={isActive}
                          className="h-10"
                        >
                          <Link
                            to={item.to}
                            className="flex w-full items-center gap-3.5 text-[15px]! rounded-lg px-3.5 py-2.5 font-medium transition-all"
                          >
                            <Icon className="h-4.5 w-4.5 shrink-0" />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-border/10 p-4 gap-2.5">
            <Button
              size="lg"
              className="w-full justify-start gap-2.5 bg-gray-800 hover:bg-gray-700 h-11"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
              Storefront Preview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2.5 text-red-500 hover:bg-destructive/10 hover:text-destructive h-10"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">Admin Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end text-xs">
                <span className="font-semibold">{user.name}</span>
                <span className="text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </header>
          <main className="flex-1 w-full max-w-[1100px] mx-auto overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
