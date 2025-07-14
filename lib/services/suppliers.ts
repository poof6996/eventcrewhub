import { prisma } from "@/lib/prisma";

/**
 * Fetches a single supplier's public profile, including their reviews and review authors.
 * @param supplierId - The ID of the supplier to fetch.
 * @returns The supplier data or null if not found.
 */
export async function getSupplierDetailsById(supplierId: number) {
  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
    include: {
      Review: { // The relation is 'Review' (uppercase) to match the model name
        include: {
          author: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return supplier;
}