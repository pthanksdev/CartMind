import "dotenv/config";
import slugify from "slugify";
import { prisma } from "../config/database.config";
import { calculateSalePrice } from "../utils/price.util";

const seedProducts = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");

    await prisma.product.deleteMany({});
    console.log("Existing products cleared");

    let adminUser = await prisma.user.findFirst({
      where: { role: "admin" },
    });

    if (!adminUser) {
      adminUser = await prisma.user.findFirst();
    }

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          name: "System Admin",
          email: "admin@system.local",
          password: "hashed_password_placeholder",
          role: "admin",
        },
      });
    }

    let category = await prisma.category.findFirst();
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: "General",
          slug: "general",
          description: "General category",
        },
      });
    }

    const rawProducts = [
      {
        name: "Fresh Apples",
        description: "Crisp and juicy red apples",
        images: ["https://example.com/apple.jpg"],
        originalPrice: 4.99,
        discountPercent: 0,
        stockCount: 100,
        unit: "kg",
        isActive: true,
      },
      {
        name: "Organic Bananas",
        description: "Sweet organic bananas",
        images: ["https://example.com/banana.jpg"],
        originalPrice: 3.49,
        discountPercent: 10,
        discountLabel: "10% OFF",
        stockCount: 75,
        unit: "kg",
        isActive: true,
      },
      {
        name: "Whole Wheat Bread",
        description: "Freshly baked whole wheat bread",
        images: ["https://example.com/bread.jpg"],
        originalPrice: 2.99,
        discountPercent: 0,
        stockCount: 50,
        unit: "pc",
        isActive: true,
      },
      {
        name: "Orange Juice",
        description: "Fresh squeezed orange juice",
        images: ["https://example.com/juice.jpg"],
        originalPrice: 5.99,
        discountPercent: 15,
        discountLabel: "15% OFF",
        stockCount: 30,
        unit: "pc",
        isActive: false,
      },
    ];

    const productData = rawProducts.map((p) => ({
      ...p,
      slug: slugify(p.name, { lower: true, strict: true }),
      salePrice:
        p.discountPercent > 0
          ? calculateSalePrice(p.originalPrice, p.discountPercent)
          : p.originalPrice,
      userId: adminUser.id,
      categoryId: category.id,
    }));

    const created = await prisma.product.createMany({
      data: productData,
    });

    console.log(`${created.count} products seeded successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seedProducts();
