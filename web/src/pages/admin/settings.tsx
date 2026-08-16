import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStoreSettingsQueryFn, updateStoreSettingsMutationFn } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Store, Save, ShieldAlert, DollarSign, Percent, Truck, Megaphone } from "lucide-react";
import { useCurrency, CURRENCIES } from "@/hooks/use-currency";
import { toast } from "sonner";

const DEFAULT_SETTINGS = {
  storeName: "CartMind",
  supportEmail: "support@cartmind.ai",
  supportPhone: "+1 (800) 555-0199",
  taxPercentage: 8.5,
  freeDeliveryThreshold: 50.0,
  defaultDeliveryFee: 5.99,
  enableBanner: true,
  bannerText: "⚡ Free Delivery on all orders over $50!",
  maintenanceMode: false,
};

const AdminSettingsPage = () => {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const currentCurrency = useCurrency((state) => state.currentCurrency);
  const setCurrency = useCurrency((state) => state.setCurrency);

  const { data, isLoading } = useQuery({
    queryKey: ["store-settings"],
    queryFn: getStoreSettingsQueryFn,
  });

  useEffect(() => {
    if (data?.settings) {
      setSettings(data.settings);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: updateStoreSettingsMutationFn,
    onSuccess: () => {
      toast.success("Store configuration settings saved to backend!");
      queryClient.invalidateQueries({ queryKey: ["store-settings"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to save settings");
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(settings);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Store Settings & Configuration</h1>
        <p className="text-sm text-muted-foreground">
          Manage global store defaults, financial thresholds, shipping rules, and top banner announcements.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Store Info */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-base font-bold">
            <Store className="size-5 text-primary" /> General Information
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Store Brand Name</label>
              <Input
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Customer Support Email</label>
              <Input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Customer Support Phone</label>
              <Input
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Default Display Currency</label>
              <select
                value={currentCurrency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium focus:outline-none"
              >
                {Object.values(CURRENCIES).map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.name} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Financial & Shipping Thresholds */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-base font-bold">
            <DollarSign className="size-5 text-primary" /> Taxes & Delivery Calculations
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Sales Tax Rate (%)</label>
              <div className="relative mt-1">
                <Input
                  type="number"
                  step="0.1"
                  value={settings.taxPercentage}
                  onChange={(e) => setSettings({ ...settings, taxPercentage: Number(e.target.value) })}
                  required
                />
                <Percent className="absolute right-3 top-3 size-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Free Delivery Threshold ($)</label>
              <div className="relative mt-1">
                <Input
                  type="number"
                  step="1"
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                  required
                />
                <Truck className="absolute right-3 top-3 size-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Standard Delivery Fee ($)</label>
              <div className="relative mt-1">
                <Input
                  type="number"
                  step="0.5"
                  value={settings.defaultDeliveryFee}
                  onChange={(e) => setSettings({ ...settings, defaultDeliveryFee: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base font-bold">
              <Megaphone className="size-5 text-primary" /> Header Announcement Banner
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Show Banner</span>
              <Switch
                checked={settings.enableBanner}
                onCheckedChange={(checked) => setSettings({ ...settings, enableBanner: checked })}
              />
            </div>
          </div>
          {settings.enableBanner && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">Announcement Message Copy</label>
              <Textarea
                rows={2}
                value={settings.bannerText}
                onChange={(e) => setSettings({ ...settings, bannerText: e.target.value })}
                placeholder="Enter promotional banner copy..."
              />
            </div>
          )}
        </div>

        {/* System Controls */}
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-base font-bold text-destructive">
                <ShieldAlert className="size-5" /> Maintenance Mode
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                When enabled, storefront checkout will present a friendly maintenance message.
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg" className="gap-2 px-8" disabled={updateMutation.isPending}>
            <Save className="size-4" /> {updateMutation.isPending ? "Saving Changes..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
