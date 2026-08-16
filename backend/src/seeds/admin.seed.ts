import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../config/database.config";

export const ensureAdminExists = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@cartmind.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";
    const adminName = process.env.ADMIN_NAME || "CartMind Admin";

    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { email: adminEmail },
          { role: "admin" },
        ],
      },
    });

    if (existingAdmin) {
      console.log(`[Admin Seed] Admin user ready in DB (Email: ${existingAdmin.email})`);
      return existingAdmin;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const newAdmin = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("✅ [Admin Seed] Admin user successfully created and saved to database!");
    console.log(`📌 Admin Email: ${newAdmin.email}`);
    console.log(`🔑 Default Password: ${adminPassword}`);
    return newAdmin;
  } catch (error) {
    console.error("⚠️ [Admin Seed] Unable to auto-seed admin user:", error);
  }
};

if (require.main === module) {
  ensureAdminExists().then(() => process.exit(0));
}
