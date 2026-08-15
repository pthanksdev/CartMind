import { prisma } from "../config/database.config";
import { UpsertCartInput } from "../validators/cart.validator";
import { BadRequestException } from "../utils/app-error";
import { calculateCartTotals } from "../utils/cart.util";
import { FREE_DELIVERY_THRESHOLD } from "../constants/constant";

const formatCartResponse = (cart: {
  id: string;
  userId: string | null;
  guestCartId: string | null;
  items: Array<{
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      slug: string;
      images: string[];
      salePrice: number;
      originalPrice: number;
      discountPercent: number;
      stockCount: number;
    };
  }>;
}) => {
  const items = cart.items.map((item) => ({
    _id: item.id,
    productId: {
      _id: item.product.id,
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      images: item.product.images,
      salePrice: item.product.salePrice,
      originalPrice: item.product.originalPrice,
      discountPercent: item.product.discountPercent,
      stockCount: item.product.stockCount,
    },
    quantity: item.quantity,
  }));

  const totals = calculateCartTotals(items);

  return {
    cart: {
      _id: cart.id,
      id: cart.id,
      userId: cart.userId,
      guestCartId: cart.guestCartId,
      items,
    },
    ...totals,
  };
};

export const upsertCartService = async (
  userId: string | null,
  guestCartId: string | null,
  data: UpsertCartInput
) => {
  if (!userId && !guestCartId) {
    throw new BadRequestException("User ID or guest cart ID is required");
  }

  const validItems: { productId: string; quantity: number }[] = [];
  const seenIds = new Set<string>();

  for (const item of data.items) {
    if (!item.productId) continue;
    if (seenIds.has(item.productId)) continue;
    seenIds.add(item.productId);
    validItems.push({
      productId: item.productId,
      quantity: item.quantity,
    });
  }

  // Find or create cart
  let cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { guestCartId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: userId || undefined,
        guestCartId: userId ? undefined : guestCartId,
      },
    });
  } else if (userId && cart.guestCartId) {
    cart = await prisma.cart.update({
      where: { id: cart.id },
      data: { guestCartId: null },
    });
  }

  if (validItems.length === 0) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return {
      cart: { items: [] },
      subtotal: 0,
      deliveryFee: 0,
      tax: 0,
      orderTotal: 0,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    };
  }

  const products = await prisma.product.findMany({
    where: {
      id: { in: validItems.map((i) => i.productId) },
      isActive: true,
    },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  const filteredItems: { productId: string; quantity: number }[] = [];
  for (const item of validItems) {
    const product = productMap.get(item.productId);
    if (!product) continue;
    filteredItems.push({
      productId: item.productId,
      quantity: Math.min(item.quantity, product.stockCount),
    });
  }

  // Replace cart items in transaction
  const updatedCart = await prisma.$transaction(async (tx) => {
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    if (filteredItems.length > 0) {
      await tx.cartItem.createMany({
        data: filteredItems.map((item) => ({
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
    }

    return tx.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
                salePrice: true,
                originalPrice: true,
                discountPercent: true,
                stockCount: true,
              },
            },
          },
        },
      },
    });
  });

  if (!updatedCart) {
    throw new BadRequestException("Failed to upsert cart");
  }

  return formatCartResponse(updatedCart);
};

export const getCartService = async (
  userId: string | null,
  guestCartId: string | null
) => {
  if (!userId && !guestCartId) {
    throw new BadRequestException("User ID or guest cart ID is required");
  }

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { guestCartId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
              salePrice: true,
              originalPrice: true,
              discountPercent: true,
              stockCount: true,
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return {
      cart: { items: [] },
      subtotal: 0,
      deliveryFee: 0,
      tax: 0,
      orderTotal: 0,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    };
  }

  return formatCartResponse(cart);
};

export const mergeGuestCartService = async (
  userId: string,
  guestCartId: string | null
) => {
  if (!guestCartId) return;

  const guestCart = await prisma.cart.findFirst({
    where: { guestCartId },
    include: { items: true },
  });

  if (!guestCart || guestCart.items.length === 0) return;

  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });

  if (!userCart) {
    await prisma.cart.update({
      where: { id: guestCart.id },
      data: {
        userId,
        guestCartId: null,
      },
    });
    return;
  }

  const mergedItems = new Map<string, number>();
  for (const item of userCart.items) {
    mergedItems.set(item.productId, item.quantity);
  }

  for (const item of guestCart.items) {
    const existing = mergedItems.get(item.productId);
    mergedItems.set(item.productId, (existing ?? 0) + item.quantity);
  }

  await prisma.$transaction(async (tx) => {
    await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });
    await tx.cartItem.createMany({
      data: Array.from(mergedItems.entries()).map(([productId, quantity]) => ({
        cartId: userCart.id,
        productId,
        quantity,
      })),
    });
    await tx.cart.delete({ where: { id: guestCart.id } });
  });
};
