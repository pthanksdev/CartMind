import { prisma } from "../config/database.config";
import { ORDER_STATUS, PAYMENT_STATUS } from "../constants/enums";
import {
  GetAdminOrdersInput,
  UpdateOrderStatusBodyInput,
  UpdateOrderStatusParamsInput,
} from "../validators/admin.validator";
import { NotFoundException } from "../utils/app-error";

export const getAdminAnalyticsService = async () => {
  const [totalOrders, totalUsers, totalProducts, outOfStockProducts, totalSalesResult] =
    await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count(),
      prisma.product.count({ where: { stockCount: { lte: 0 } } }),
      prisma.order.aggregate({
        where: { paymentStatus: PAYMENT_STATUS.PAID },
        _sum: { total: true },
      }),
    ]);

  const totalSales = totalSalesResult._sum?.total ?? 0;

  return {
    totalSales,
    totalOrders,
    totalUsers,
    totalProducts,
    totalOutOfStock: outOfStockProducts,
  };
};

export const getAdminOrdersService = async ({
  page,
  limit,
}: GetAdminOrdersInput) => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
        items: true,
        shippingAddress: true,
        statusHistory: true,
      },
    }),
    prisma.order.count(),
  ]);

  const formattedOrders = orders.map((o) => ({
    ...o,
    _id: o.id,
    userId: {
      name: o.user.name,
      email: o.user.email,
    },
    items: o.items.map((i) => ({ ...i, _id: i.id })),
  }));

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    orders: formattedOrders,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  };
};

export const updateOrderStatusService = async (
  params: UpdateOrderStatusParamsInput,
  body: UpdateOrderStatusBodyInput
) => {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { statusHistory: true },
  });

  if (!order) throw new NotFoundException("Order not found");

  const statusExistsInHistory = order.statusHistory.some(
    (entry) => entry.status === body.status
  );

  const paymentStatus =
    body.status === ORDER_STATUS.DELIVERED && (order.paymentStatus as string) !== PAYMENT_STATUS.PAID
      ? PAYMENT_STATUS.PAID
      : order.paymentStatus;

  const updatedOrder = await prisma.order.update({
    where: { id: params.id },
    data: {
      status: body.status as any,
      paymentStatus: paymentStatus as any,
      statusHistory: statusExistsInHistory
        ? undefined
        : {
            create: {
              status: body.status as any,
              note: body.note || `Status updated to ${body.status} by admin`,
              date: new Date(),
            },
          },
    },
    include: {
      items: true,
      shippingAddress: true,
      statusHistory: true,
    },
  });

  const formattedOrder = {
    ...updatedOrder,
    _id: updatedOrder.id,
    items: updatedOrder.items.map((i) => ({ ...i, _id: i.id })),
  };

  return { order: formattedOrder };
};

export const getAdminCustomersService = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            total: true,
          },
        },
      },
    }),
    prisma.user.count(),
  ]);

  const formattedCustomers = users.map((u) => {
    const totalSpent = u.orders.reduce((sum, o) => sum + o.total, 0);
    return {
      id: u.id,
      _id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      orderCount: u.orders.length,
      totalSpent,
    };
  });

  const totalPages = Math.ceil(total / limit);

  return {
    customers: formattedCustomers,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export const updateProductStockService = async (
  productId: string,
  stockCount: number
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) throw new NotFoundException("Product not found");

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: { stockCount },
  });

  return { product: { ...updatedProduct, _id: updatedProduct.id } };
};

