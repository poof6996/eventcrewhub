import Link from "next/link";

export default function BookingSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Request Sent!</h1>
      <p className="text-xl text-gray-700">The supplier has received your request and will be in touch soon.</p>
      <Link href="/browse" className="mt-8 inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700">
        Browse More Services
      </Link>
    </div>
  );
}