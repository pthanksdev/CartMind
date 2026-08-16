import "dotenv/config";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import { prisma } from "../config/database.config";
import { seedProducts } from "./product.seed";

const defaultCategories = [
  { name: "Beverages", imageUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1781265027/Beverages_lcunrb.png", description: "Drinks, juices, and everyday refreshments.", isActive: true },
  { name: "Snacks", imageUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1781265027/Snacks_wxordv.png", description: "Chips, biscuits, and quick bites.", isActive: true },
  { name: "Bakery", imageUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1781265027/Bakery_xwbrje.png", description: "Fresh bread, pastries, and baked goods.", isActive: true },
  { name: "Baby Care", imageUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1781265026/Baby_Care_bxxwu0.png", description: "Essentials for infants and toddlers.", isActive: true },
  { name: "Frozen Foods", imageUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1781265027/Frozen_Foods_wknnin.png", description: "Frozen meals and freezer staples.", isActive: true },
  { name: "Fruits & Vegetables", imageUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1781265026/Fruits_Vegetables_lnmslm.png", description: "Fresh produce for everyday cooking.", isActive: true },
  { name: "Meat & Seafood", imageUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1781265026/Meat_Seafood_nhtxen.png", description: "Fresh meat, fish, and seafood options.", isActive: true },
  { name: "Pantry Staples", imageUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1781265027/Pantry_Staples_ppwolo.png", description: "Rice, flour, oil, and pantry basics.", isActive: true },
  { name: "Personal Care", imageUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1781265026/Personal_Care_osossq.png", description: "Daily hygiene and personal grooming items.", isActive: true },
];

export const ensureAdminExists = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@cartmind.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";
    const adminName = process.env.ADMIN_NAME || "CartMind Admin";

    let adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: adminEmail },
          { role: "admin" },
        ],
      },
    }).catch(() => null);

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      adminUser = await prisma.user.create({
        data: {
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
        },
      }).catch(() => null);

      if (adminUser) {
        console.log("✅ [Admin Seed] Admin user successfully created and saved to database!");
        console.log(`📌 Admin Email: ${adminUser.email}`);
      }
    } else {
      console.log(`[Admin Seed] Admin user ready in DB (Email: ${adminUser.email})`);
    }

    // Auto-seed categories if empty
    const categoryCount = await prisma.category.count().catch(() => 0);
    if (categoryCount === 0) {
      const categoryData = defaultCategories.map((cat) => ({
        ...cat,
        slug: slugify(cat.name, { lower: true, strict: true }),
      }));
      await prisma.category.createMany({ data: categoryData }).catch(() => null);
      console.log("✅ [Category Seed] Default categories auto-seeded successfully!");
    }

    // Auto-seed products if database has fewer than 10 products
    const productCount = await prisma.product.count().catch(() => 0);
    if (productCount < 10) {
      await seedProducts();
    }

    return adminUser;
  } catch (error) {
    console.error("⚠️ [Seed Error]:", error);
  }
};

// Auto-seed function called cleanly during startup
