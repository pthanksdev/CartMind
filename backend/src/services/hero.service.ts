import { prisma } from "../config/database.config";

export const getHeroBannersService = async () => {
  let banners = await prisma.heroBanner.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  // Seed default banners if database table is currently empty
  if (banners.length === 0) {
    await prisma.heroBanner.createMany({
      data: [
        {
          subtitle: "New Customers Offer",
          title: "$0 Delivery Fees on orders over $20",
          action: "Shop now",
          actionUrl: "/products",
          note: "Min spend $20. No delivery fees apply.",
          imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
          order: 1,
        },
        {
          subtitle: "Fresh Farm Picks Daily",
          title: "Build your week around organic produce that tastes better",
          action: "Explore Fresh Deals",
          actionUrl: "/products",
          note: "Seasonal groceries delivered fresh to your door.",
          imageUrl: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80",
          order: 2,
        },
        {
          subtitle: "Community Grocery Drive",
          title: "Supporting families with fresh seasonal produce",
          action: "Support & Shop",
          actionUrl: "/products",
          note: "Helping local communities access healthy food.",
          imageUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80",
          order: 3,
        },
      ],
    });

    banners = await prisma.heroBanner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }

  return banners;
};

export const createHeroBannerService = async (data: {
  subtitle?: string;
  title: string;
  action?: string;
  actionUrl?: string;
  note?: string;
  imageUrl: string;
  order?: number;
}) => {
  const banner = await prisma.heroBanner.create({
    data: {
      subtitle: data.subtitle,
      title: data.title,
      action: data.action || "Shop now",
      actionUrl: data.actionUrl || "/products",
      note: data.note,
      imageUrl: data.imageUrl,
      order: data.order || 0,
    },
  });
  return banner;
};

export const deleteHeroBannerService = async (id: string) => {
  await prisma.heroBanner.delete({ where: { id } });
  return { message: "Hero banner deleted successfully" };
};
