import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";
import { ToastHandler } from "@/components/toast-handler";

export default async function MyBookingsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const bookings = await prisma.booking.findMany({
    where: { customerId: parseInt(session.user.id) },
    include: { supplier: true },
    orderBy: { eventDate: 'asc' },
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToastHandler />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">My Bookings</h1>
        <p className="text-xl mb-8">
          Welcome, {session.user.name}! Here is the status of all your booking requests.
        </p>

        {bookings.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.supplier.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(booking.eventDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'PAID' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {booking.status === 'CONFIRMED' && (
                          // UPDATED: This is now a Link, not a form
                          <Link href={`/bookings/${booking.id}/checkout`} className="text-white bg-green-600 hover:bg-green-700 font-bold px-4 py-2 rounded-full text-xs">
                             Pay Deposit
                          </Link>
                        )}
                        {booking.status === 'PAID' && (
                          <Link href={`/bookings/${booking.id}/review`} className="text-blue-600 hover:text-blue-900">
                            Leave a Review
                          </Link>
                        )}
                         {booking.status === 'PENDING' && (
                           <span className="text-gray-500">Awaiting Supplier</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600">You have not made any booking requests yet.</p>
            <Link href="/browse" className="mt-4 inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700">
              Browse Services
            </Link>
          </div>
        )}
      </div>
    </Suspense>
  );
}