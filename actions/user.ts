"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleSaveSupplier(supplierId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Authentication required.");
  }
  const userId = parseInt(session.user.id);

  // Check if the user has already saved this supplier
  const existingSavedSupplier = await prisma.user.findFirst({
    where: {
      id: userId,
      savedSuppliers: {
        some: {
          id: supplierId,
        },
      },
    },
  });

  if (existingSavedSupplier) {
    // If already saved, unsave it by disconnecting the relation
    await prisma.user.update({
      where: { id: userId },
      data: {
        savedSuppliers: {
          disconnect: { id: supplierId },
        },
      },
    });
    revalidatePath(`/supplier/${supplierId}`);
    return { saved: false };
  } else {
    // If not saved, save it by connecting the relation
    await prisma.user.update({
      where: { id: userId },
      data: {
        savedSuppliers: {
          connect: { id: supplierId },
        },
      },
    });
    revalidatePath(`/supplier/${supplierId}`);
    return { saved: true };
  }
}