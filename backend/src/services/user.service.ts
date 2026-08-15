import bcrypt from "bcryptjs";
import { prisma } from "../config/database.config";
import { NotFoundException } from "../utils/app-error";

export const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
};

export const updateUserProfileService = async (
  userId: string,
  data: {
    name?: string;
    phone?: string;
    avatar?: string;
    password?: string;
  }
) => {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new NotFoundException("User not found");
  }

  let hashedPassword = undefined;
  if (data.password && data.password.trim() !== "") {
    hashedPassword = await bcrypt.hash(data.password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.avatar !== undefined && { avatar: data.avatar }),
      ...(hashedPassword && { password: hashedPassword }),
    },
  });

  const { password, ...rest } = updatedUser;
  return { user: rest };
};
