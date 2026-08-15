import { prisma } from "../config/database.config";
import { Prisma } from "@prisma/client";
import slugify from "slugify";
import { calculateSalePrice } from "../utils/price.util";
import {
  GetProductsInput,
  GetDealsInput,
  GetProductBySlugInput,
  GetProductReviewsInput,
  CreateProductInput,
  GetProductsForAdminInput,
} from "../validators/product.validator";
import { BadRequestException, NotFoundException } from "../utils/app-error";

export const getProductsService = async (query: GetProductsInput) => {
  const {
    categoryId,
    page,
    limit,
    hasDiscount,
    inStock,
    minPrice,
    maxPrice,
    sort,
    keyword,
    skip,
  } = query;

  const where: Prisma.ProductWhereInput = { isActive: true };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (hasDiscount !== undefined) {
    where.discountPercent = hasDiscount ? { gt: 0 } : 0;
  }

  if (inStock !== undefined) {
    where.stockCount = { gt: 0 };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.salePrice = {};
    if (minPrice !== undefined) {
      where.salePrice.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      where.salePrice.lte = maxPrice;
    }
  }

  if (keyword) {
    where.OR = [
      { name: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
    ];
  }

  type SortOption = "best-match" | "price-low" | "price-high" | "highest-rating";

  const orderByMap: Record<SortOption, Prisma.ProductOrderByWithRelationInput> = {
    "best-match": { createdAt: "desc" },
    "price-low": { salePrice: "asc" },
    "price-high": { salePrice: "desc" },
    "highest-rating": { ratingAverage: "desc" },
  };

  const effectiveSkip = skip ?? (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: orderByMap[sort],
      skip: effectiveSkip,
      take: limit,
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const formattedProducts = products.map((product) => ({
    ...product,
    categoryId: {
      _id: product.category.slug, // compatible mapping for frontend
      name: product.category.name,
      slug: product.category.slug,
    },
  }));

  const totalPages = Math.ceil(total / limit);

  return {
    products: formattedProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: effectiveSkip + limit < total,
      hasPrevPage: page > 1,
    },
  };
};

export const getDealsService = async (query: GetDealsInput) => {
  const { limit } = query;
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      discountPercent: { gt: 0 },
      stockCount: { gt: 0 },
    },
    orderBy: { discountPercent: "desc" },
    take: limit,
  });

  return { products };
};

export const getProductBySlugService = async ({
  slug,
}: GetProductBySlugInput) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  if (!product || !product.isActive) {
    throw new NotFoundException("Product not found");
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      NOT: { slug },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const formattedProduct = {
    ...product,
    categoryId: {
      _id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
  };

  return { product: formattedProduct, relatedProducts };
};

export const getProductReviewsService = async ({
  slug,
  page,
  limit,
}: GetProductReviewsInput) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!product) throw new NotFoundException("Product not found");

  const productId = product.id;
  const skip = (page - 1) * limit;

  const [reviews, total, ratingAgg] = await Promise.all([
    prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: {
          select: { name: true, avatar: true },
        },
      },
    }),
    prisma.review.count({ where: { productId } }),
    prisma.review.groupBy({
      by: ["rating"],
      where: { productId },
      _count: { rating: true },
    }),
  ]);

  const breakdownMap: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const item of ratingAgg) {
    breakdownMap[item.rating] = item._count.rating;
  }

  const ratingBreakdown = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: breakdownMap[rating],
  }));

  const totalPages = Math.ceil(total / limit);

  const formattedReviews = reviews.map((r) => ({
    ...r,
    userId: {
      name: r.user.name,
      avatar: r.user.avatar,
    },
  }));

  return {
    reviews: formattedReviews,
    ratingBreakdown,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: skip + limit < total,
      hasPrevPage: page > 1,
    },
  };
};

export const createProductService = async (
  userId: string,
  data: CreateProductInput
) => {
  const { categoryId, name, originalPrice, discountPercent = 0 } = data;

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw new BadRequestException("Category not found");
  }

  const slug = slugify(name, { lower: true, strict: true });
  const salePrice =
    discountPercent > 0
      ? calculateSalePrice(originalPrice, discountPercent)
      : originalPrice;

  const product = await prisma.product.create({
    data: {
      ...data,
      slug,
      salePrice,
      discountPercent,
      userId,
      categoryId,
    },
  });

  return product;
};

export const getProductsForAdminService = async (
  query: GetProductsForAdminInput
) => {
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    }),
    prisma.product.count(),
  ]);

  const formattedProducts = products.map((p) => ({
    ...p,
    categoryId: {
      name: p.category.name,
      slug: p.category.slug,
    },
  }));

  const totalPages = Math.ceil(total / limit);

  return {
    products: formattedProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: skip + limit < total,
      hasPrevPage: page > 1,
    },
  };
};

export const getProductByIdService = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  if (!product) {
    throw new NotFoundException("Product not found");
  }

  return { product };
};

export const updateProductService = async (
  id: string,
  data: Partial<CreateProductInput> & { isActive?: boolean }
) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundException("Product not found");
  }

  const name = data.name ?? existing.name;
  const slug = data.name ? slugify(name, { lower: true, strict: true }) : existing.slug;
  const originalPrice = data.originalPrice ?? existing.originalPrice;
  const discountPercent = data.discountPercent ?? existing.discountPercent;
  const salePrice =
    discountPercent > 0
      ? calculateSalePrice(originalPrice, discountPercent)
      : originalPrice;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      slug,
      originalPrice,
      discountPercent,
      salePrice,
    },
  });

  return { product };
};
