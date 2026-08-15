import { prisma } from "../config/database.config";
import { BadRequestException, UnauthorizedException } from "../utils/app-error";
import { RegisterInput, LoginInput } from "../validators/auth.validator";
import { mergeGuestCartService } from "./cart.service";
import { hashValue, compareValue } from "../utils/bcrypt.util";

const sanitizeUser = <T extends { password?: string }>(user: T) => {
  const { password, ...rest } = user;
  return rest;
};

export const registerService = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser) {
    throw new BadRequestException("Email already in use");
  }
  const hashedPassword = await hashValue(data.password);
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
  return sanitizeUser(user);
};

export const loginService = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedException("Invalid email or password");
  }

  const isMatch = await compareValue(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedException("Invalid email or password");
  }

  return sanitizeUser(user);
};

export const registerAndMergeGuestCart = async (
  data: RegisterInput,
  guestCartId: string | null
) => {
  const user = await registerService(data);
  await mergeGuestCartService(user.id, guestCartId);
  return user;
};

export const loginAndMergeGuestCart = async (
  email: string,
  password: string,
  guestCartId: string | null
) => {
  const user = await loginService({ email, password });
  await mergeGuestCartService(user.id, guestCartId);
  return user;
};
