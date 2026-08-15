import { Request, Response } from "express";
import stripeClient from "../config/stripe.config";
import { envConfig } from "../config/env.config";
import { prisma } from "../config/database.config";
import { ORDER_STATUS, PAYMENT_STATUS } from "../constants/enums";

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;
  try {
    event = stripeClient.webhooks.constructEvent(
      req.body,
      sig,
      envConfig.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    res.status(400).json({ message: "Webhook signature verification failed" });
    return;
  }

  const session = event.data.object as {
    metadata?: { orderId?: string };
  };
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    res.status(200).json({ received: true });
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) {
    res.status(200).json({ received: true });
    return;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: PAYMENT_STATUS.PAID as any,
            status: ORDER_STATUS.CONFIRMED as any,
            statusHistory: {
              create: {
                status: ORDER_STATUS.CONFIRMED as any,
                date: new Date(),
              },
            },
          },
        });

        const userCart = await tx.cart.findFirst({
          where: { userId: order.userId },
        });

        if (userCart) {
          await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });
          await tx.cart.delete({ where: { id: userCart.id } });
        }

        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockCount: {
                decrement: item.quantity,
              },
            },
          });
        }
      });

      console.log(`Order ${order.orderNo} paid and confirmed`);
      break;
    }

    case "checkout.session.expired": {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PAYMENT_STATUS.FAILED as any,
          status: ORDER_STATUS.CANCELLED as any,
          statusHistory: {
            create: {
              status: ORDER_STATUS.CANCELLED as any,
              date: new Date(),
            },
          },
        },
      });

      console.log(`Order ${order.orderNo} payment expired`);
      break;
    }
  }

  res.status(200).json({ received: true });
};
