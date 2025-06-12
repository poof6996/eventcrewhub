"use client";

import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function PaymentSuccessPage() {
  
  // Show a success toast when the component mounts
  useEffect(() => {
    toast.success("Payment completed successfully!");
  }, []);

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="text-xl text-gray-700">Thank you for your payment. Your booking has been updated.</p>
      <Link href="/my-bookings" className="mt-8 inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700">
        View My Bookings
      </Link>
    </div>
  );
}