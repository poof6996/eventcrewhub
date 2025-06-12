"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function createCheckoutSessionAction(bookingId: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Authentication required");

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId, customerId: session.user.id },
    include: { supplier: true },
  });

  if (!booking) throw new Error("Booking not found or permission denied.");

  const depositAmount = 2000; // £20.00 in pence
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Deposit for ${booking.supplier.name}`,
            description: `Booking deposit for event on ${new Date(booking.eventDate).toLocaleDateString()}`,
          },
          unit_amount: depositAmount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId: booking.id.toString(),
    },
    success_url: `${baseUrl}/payment/success`,
    cancel_url: `${baseUrl}/payment/cancel`,
  });

  if (!checkoutSession.url) {
    throw new Error("Could not create Stripe Checkout session.");
  }
  
  redirect(checkoutSession.url);
}