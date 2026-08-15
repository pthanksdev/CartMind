import slugify from "slugify";
import { prisma } from "../config/database.config";
import { NotFoundException } from "../utils/app-error";

export const getCategoriesService = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "asc" },
  });

  return { categories };
};

export const createCategoryService = async (data: {
  name: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}) => {
  const slug = slugify(data.name, { lower: true, strict: true });

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      imageUrl: data.imageUrl,
      isActive: data.isActive ?? true,
    },
  });

  return { category };
};

export const updateCategoryService = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
  }
) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundException("Category not found");
  }

  const slug = data.name
    ? slugify(data.name, { lower: true, strict: true })
    : undefined;

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name, slug }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });

  return { category };
};
