import { prisma } from "../config/database.config";
import { NotFoundException, BadRequestException } from "../utils/app-error";

export const getOrCreateWalletService = async (userId: string) => {
  let wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: {
        userId,
        balance: 0.0,
      },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  return wallet;
};

export const topupWalletService = async (userId: string, amount: number) => {
  if (amount <= 0) {
    throw new BadRequestException("Top-up amount must be greater than zero");
  }

  const wallet = await getOrCreateWalletService(userId);

  const updatedWallet = await prisma.wallet.update({
    where: { id: wallet.id },
    data: {
      balance: { increment: amount },
      transactions: {
        create: {
          type: "topup",
          description: "Wallet Instant Topup via Card",
          amount: amount,
          status: "completed",
        },
      },
    },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return updatedWallet;
};

export const requestWithdrawalService = async (
  userId: string,
  amount: number,
  bankDetails: string
) => {
  if (amount <= 0) {
    throw new BadRequestException("Withdrawal amount must be greater than zero");
  }

  const wallet = await getOrCreateWalletService(userId);

  if (wallet.balance < amount) {
    throw new BadRequestException("Insufficient wallet balance for withdrawal");
  }

  const updatedWallet = await prisma.wallet.update({
    where: { id: wallet.id },
    data: {
      balance: { decrement: amount },
      transactions: {
        create: {
          type: "withdrawal",
          description: `Withdrawal request to Bank (${bankDetails})`,
          amount: -amount,
          status: "pending",
          bankDetails: bankDetails,
        },
      },
    },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return updatedWallet;
};

export const issueRefundCreditService = async (
  customerEmail: string,
  amount: number,
  note?: string
) => {
  if (amount <= 0) {
    throw new BadRequestException("Refund credit amount must be greater than zero");
  }

  const user = await prisma.user.findUnique({
    where: { email: customerEmail },
  });

  if (!user) {
    throw new NotFoundException(`No user found with email ${customerEmail}`);
  }

  const wallet = await getOrCreateWalletService(user.id);

  const updatedWallet = await prisma.wallet.update({
    where: { id: wallet.id },
    data: {
      balance: { increment: amount },
      transactions: {
        create: {
          type: "refund_credit",
          description: note || `Refund credited to wallet`,
          amount: amount,
          status: "completed",
        },
      },
    },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return updatedWallet;
};

export const getAdminPayoutsService = async () => {
  const pendingTransactions = await prisma.walletTransaction.findMany({
    where: { type: "withdrawal" },
    include: {
      wallet: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return pendingTransactions;
};

export const approvePayoutService = async (transactionId: string) => {
  const transaction = await prisma.walletTransaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction) {
    throw new NotFoundException("Withdrawal transaction request not found");
  }

  const updatedTransaction = await prisma.walletTransaction.update({
    where: { id: transactionId },
    data: { status: "approved" },
  });

  return updatedTransaction;
};
