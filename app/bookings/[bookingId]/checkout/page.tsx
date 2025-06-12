"use client";

import { createCheckoutSessionAction } from "@/actions/payment";
import { useEffect, useState, useTransition } from "react";
import type { Prisma } from "@prisma/client";
import toast from "react-hot-toast";

// We need a separate function to fetch data in a Client Component
async function getBookingDetails(bookingId: number) {
    // In a real app, you would create an API route for this.
    // For simplicity, we will assume this is an API call.
    // This part of the code will need to be adapted with an API route.
    // For now, this will not run correctly as client components can't directly call prisma.
    // The following is a placeholder for the structure.
    return null; 
}

// THIS IS A PLACEHOLDER - WE WILL REFACTOR THIS IN THE NEXT STEP
// For now, this demonstrates the UI and form structure.

export default function CheckoutPage({ params }: { params: { bookingId: string } }) {
  const [isPending, startTransition] = useTransition();

  const handlePayment = () => {
    startTransition(async () => {
      try {
        await createCheckoutSessionAction(parseInt(params.bookingId));
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Confirm Your Booking</h1>

        {/* Booking Details Summary */}
        <div className="border rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold">Booking Summary</h2>
            <p className="text-gray-600">Placeholder for Supplier Name</p>
            <p className="text-gray-600">Placeholder for Event Date</p>
            <div className="text-2xl font-bold mt-4">Deposit: £20.00</div>
        </div>

        {/* Form that triggers the payment */}
        <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Processing..." : "Proceed to Payment"}
          </button>
        </form>
      </div>
    </div>
  );
}