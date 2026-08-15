import { prisma } from "../config/database.config";
import { NotFoundException, BadRequestException } from "../utils/app-error";

export const createInquiryService = async (data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) => {
  if (!data.name || !data.email || !data.message) {
    throw new BadRequestException("Name, email, and message are required");
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject || "General Customer Support Inquiry",
      message: data.message,
      status: "pending",
    },
  });

  return inquiry;
};

export const getAllInquiriesService = async () => {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return inquiries;
};

export const resolveInquiryService = async (id: string) => {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
  });

  if (!inquiry) {
    throw new NotFoundException("Inquiry message not found");
  }

  const updated = await prisma.inquiry.update({
    where: { id },
    data: { status: "resolved" },
  });

  return updated;
};
