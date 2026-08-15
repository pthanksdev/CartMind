import { prisma } from "../config/database.config";
import { CreateOrderInput } from "../validators/order.validator";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { calculateCartTotals } from "../utils/cart.util";
import { PAYMENT_METHODS, ORDER_STATUS } from "../constants/enums";
import stripeClient from "../config/stripe.config";
import { envConfig } from "../config/env.config";
import { generateOrderNo } from "../utils/order.util";

export const createOrderService = async (
  userId: string,
  data: CreateOrderInput
) => {
  const { addressId, paymentMethod } = data;

  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new BadRequestException("Cart is empty");
  }

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!address) {
    throw new NotFoundException("Address not found");
  }

  const items = cart.items.map((item) => ({
    productId: {
      _id: item.product.id,
      id: item.product.id,
      name: item.product.name,
      images: item.product.images,
      originalPrice: item.product.originalPrice,
      discountPercent: item.product.discountPercent,
      salePrice: item.product.salePrice,
      stockCount: item.product.stockCount,
    },
    quantity: item.quantity,
  }));

  const totals = calculateCartTotals(items);

  const orderItemsData = items.map((item) => ({
    productId: item.productId.id,
    name: item.productId.name,
    image: item.productId.images?.[0] ?? "",
    originalPrice: item.productId.originalPrice,
    discountPercent: item.productId.discountPercent,
    salePrice: item.productId.salePrice,
    quantity: item.quantity,
  }));

  const shippingAddressData = {
    recipientName: address.recipientName,
    phone: address.phone,
    street: address.street,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
  };

  const orderNo = generateOrderNo();

  const order = await prisma.order.create({
    data: {
      userId,
      orderNo,
      paymentMethod: paymentMethod as any,
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      tax: totals.tax,
      total: totals.orderTotal,
      shippingAddress: {
        create: shippingAddressData,
      },
      items: {
        create: orderItemsData,
      },
      statusHistory: {
        create: [
          {
            status: ORDER_STATUS.PLACED as any,
          },
        ],
      },
    },
    include: {
      items: true,
      shippingAddress: true,
      statusHistory: true,
    },
  });

  if (paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY) {
    await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.delete({ where: { id: cart.id } });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId.id },
          data: {
            stockCount: {
              decrement: item.quantity,
            },
          },
        });
      }
    });

    const formattedOrder = {
      ...order,
      _id: order.id,
      items: order.items.map((i) => ({ ...i, _id: i.id })),
    };

    return { order: formattedOrder, stripeUrl: null };
  }

  const lineItems: Array<{
    price_data: {
      currency: string;
      product_data: { name: string; images?: string[] };
      unit_amount: number;
    };
    quantity: number;
  }> = orderItemsData.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.salePrice * 100),
    },
    quantity: item.quantity,
  }));

  if (totals.deliveryFee > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Fee" },
        unit_amount: Math.round(totals.deliveryFee * 100),
      },
      quantity: 1,
    });
  }

  if (totals.tax > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Tax" },
        unit_amount: Math.round(totals.tax * 100),
      },
      quantity: 1,
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  const customerEmail = user?.email;

  const session = await stripeClient.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: customerEmail,
    line_items: lineItems,
    metadata: {
      orderId: order.id,
    },
    success_url: `${envConfig.FRONTEND_ORIGIN}/orders/${order.id}`,
    cancel_url: `${envConfig.FRONTEND_ORIGIN}/checkout`,
  });

  return { stripeUrl: session.url! };
};

export const getUserOrdersService = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      shippingAddress: true,
      statusHistory: true,
    },
  });

  const formattedOrders = orders.map((o) => ({
    ...o,
    _id: o.id,
    items: o.items.map((i) => ({ ...i, _id: i.id })),
  }));

  return { orders: formattedOrders };
};

export const getUserOrderByIdService = async (
  userId: string,
  orderId: string
) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: true,
      shippingAddress: true,
      statusHistory: true,
    },
  });

  if (!order) {
    throw new NotFoundException("Order not found");
  }

  const formattedOrder = {
    ...order,
    _id: order.id,
    items: order.items.map((i) => ({ ...i, _id: i.id })),
  };

  return { order: formattedOrder };
};
