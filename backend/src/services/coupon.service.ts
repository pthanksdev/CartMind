import { prisma } from "../config/database.config";
import { NotFoundException, BadRequestException } from "../utils/app-error";

export const createCouponService = async (data: {
  code: string;
  type: "percentage" | "fixed";
  discountValue: number;
  minSpend?: number;
  maxUsage?: number;
  expiresAt: Date | string;
}) => {
  const code = data.code.toUpperCase().trim();

  const existing = await prisma.coupon.findUnique({
    where: { code },
  });

  if (existing) {
    throw new BadRequestException(`Coupon code "${code}" already exists`);
  }

  const coupon = await prisma.coupon.create({
    data: {
      code,
      type: data.type,
      discountValue: data.discountValue,
      minSpend: data.minSpend || 0,
      maxUsage: data.maxUsage || 100,
      expiresAt: new Date(data.expiresAt),
    },
  });

  return coupon;
};

export const getAllCouponsService = async () => {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
  return coupons;
};

export const getActiveCouponsService = async () => {
  const coupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      expiresAt: { gte: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });
  return coupons;
};

export const toggleCouponStatusService = async (couponId: string) => {
  const coupon = await prisma.coupon.findUnique({
    where: { id: couponId },
  });

  if (!coupon) {
    throw new NotFoundException("Coupon not found");
  }

  const updated = await prisma.coupon.update({
    where: { id: couponId },
    data: { isActive: !coupon.isActive },
  });

  return updated;
};

export const deleteCouponService = async (couponId: string) => {
  const coupon = await prisma.coupon.findUnique({
    where: { id: couponId },
  });

  if (!coupon) {
    throw new NotFoundException("Coupon not found");
  }

  await prisma.coupon.delete({
    where: { id: couponId },
  });

  return { message: "Coupon deleted successfully" };
};

export const validateCouponService = async (code: string, cartTotal: number) => {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase().trim() },
  });

  if (!coupon || !coupon.isActive) {
    throw new BadRequestException("Invalid or inactive coupon code");
  }

  if (new Date() > new Date(coupon.expiresAt)) {
    throw new BadRequestException("Coupon code has expired");
  }

  if (coupon.usageCount >= coupon.maxUsage) {
    throw new BadRequestException("Coupon usage limit has been reached");
  }

  if (cartTotal < coupon.minSpend) {
    throw new BadRequestException(
      `Minimum spend of $${coupon.minSpend} required for coupon "${coupon.code}"`
    );
  }

  let discount = 0;
  if (coupon.type === "percentage") {
    discount = (cartTotal * coupon.discountValue) / 100;
  } else {
    discount = coupon.discountValue;
  }

  return {
    code: coupon.code,
    discount: Math.min(discount, cartTotal),
    type: coupon.type,
    discountValue: coupon.discountValue,
  };
};
