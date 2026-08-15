import { prisma } from "../config/database.config";

export const getStoreSettingsService = async () => {
  let settings = await prisma.storeSetting.findFirst();

  if (!settings) {
    settings = await prisma.storeSetting.create({
      data: {
        storeName: "StoreFast",
        supportEmail: "support@storefast.com",
        supportPhone: "+1 (800) 555-0199",
        taxPercentage: 8.5,
        freeDeliveryThreshold: 50.0,
        defaultDeliveryFee: 5.99,
        enableBanner: true,
        bannerText: "⚡ Free Delivery on all orders over $50!",
        maintenanceMode: false,
      },
    });
  }

  return settings;
};

export const updateStoreSettingsService = async (data: {
  storeName?: string;
  supportEmail?: string;
  supportPhone?: string;
  taxPercentage?: number;
  freeDeliveryThreshold?: number;
  defaultDeliveryFee?: number;
  enableBanner?: boolean;
  bannerText?: string;
  maintenanceMode?: boolean;
}) => {
  const current = await getStoreSettingsService();

  const updated = await prisma.storeSetting.update({
    where: { id: current.id },
    data,
  });

  return updated;
};
