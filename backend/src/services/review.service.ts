import { prisma } from "../config/database.config";
import { CreateReviewInput } from "../validators/review.validator";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { ORDER_STATUS, PAYMENT_STATUS } from "../constants/enums";

export const createReviewService = async (
  userId: string,
  data: CreateReviewInput
) => {
  const { orderId, orderItemId, rating, comment } = data;

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true },
  });

  if (!order) {
    throw new NotFoundException("Order not found");
  }

  if (
    (order.status as string) !== ORDER_STATUS.DELIVERED ||
    (order.paymentStatus as string) !== PAYMENT_STATUS.PAID
  ) {
    throw new BadRequestException(
      "Order must be delivered and paid to leave a review"
    );
  }

  const orderItem = order.items.find((item) => item.id === orderItemId);
  if (!orderItem) {
    throw new NotFoundException("Order item not found in this order");
  }

  const existingReview = await prisma.review.findUnique({
    where: { orderItemId },
  });
  if (existingReview) {
    throw new BadRequestException("You have already reviewed this item");
  }

  const review = await prisma.$transaction(async (tx) => {
    const createdReview = await tx.review.create({
      data: {
        userId,
        orderId,
        orderItemId,
        productId: orderItem.productId,
        rating,
        comment,
      },
    });

    await tx.orderItem.update({
      where: { id: orderItemId },
      data: { isReviewed: true },
    });

    const agg = await tx.review.aggregate({
      where: { productId: orderItem.productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const newAverage =
      agg._avg.rating != null
        ? Math.round(agg._avg.rating * 10) / 10
        : 0;
    const newCount = agg._count.rating ?? 0;

    await tx.product.update({
      where: { id: orderItem.productId },
      data: {
        ratingAverage: newAverage,
        reviewCount: newCount,
      },
    });

    return createdReview;
  });

  return { review };
};

export const getUserReviewsService = async (userId: string) => {
  const reviews = await prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: { name: true, slug: true, images: true },
      },
    },
  });

  const formattedReviews = reviews.map((r) => ({
    ...r,
    _id: r.id,
    productId: {
      name: r.product.name,
      slug: r.product.slug,
      images: r.product.images,
    },
  }));

  return { reviews: formattedReviews };
};

export const getUserReviewableOrderItemsService = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: {
      userId,
      status: ORDER_STATUS.DELIVERED as any,
      paymentStatus: PAYMENT_STATUS.PAID as any,
      items: {
        some: { isReviewed: false },
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  const filteredOrders = orders.map((order) => ({
    ...order,
    _id: order.id,
    items: order.items
      .filter((item) => item.isReviewed === false)
      .map((item) => ({ ...item, _id: item.id })),
  }));

  return { orders: filteredOrders };
};
