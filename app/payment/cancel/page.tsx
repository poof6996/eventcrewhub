import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
      <p className="text-xl text-gray-700">Your payment process was cancelled. You can try again from your bookings page.</p>
      <Link href="/my-bookings" className="mt-8 inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700">
        Return to My Bookings
      </Link>
    </div>
  );
}