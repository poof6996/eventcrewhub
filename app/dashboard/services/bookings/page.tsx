import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { BookingStatus } from "@prisma/client";

async function updateBookingStatus(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'SUPPLIER') {
    throw new Error("Unauthorized");
  }

  const bookingIdString = formData.get("bookingId") as string;
  if (!bookingIdString) throw new Error("Booking ID is required.");
  
  const bookingId = parseInt(bookingIdString);
  const newStatus = formData.get("status") as BookingStatus;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { supplier: true },
  });

  if (booking?.supplier.userId !== session.user.id) {
    throw new Error("Forbidden: You do not own this booking.");
  }
  
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: newStatus },
  });

  revalidatePath("/dashboard/bookings");
}

export default async function ManageBookingsPage() {
  const session = await auth();
  if (!session?.user) return null;

  // Fetch all bookings for the current supplier
  const bookings = await prisma.booking.findMany({
    where: {
        supplier: {
            userId: session.user.id,
        }
    },
    include: {
        customer: true,
    },
    orderBy: {
        createdAt: 'desc'
    }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Bookings</h1>
        <p className="text-gray-600">Review and manage all your incoming service requests.</p>
      </div>
      
      {bookings.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.customer.name ?? 'N/A'}</div>
                      <div className="text-sm text-gray-500">{booking.customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(booking.eventDate).toLocaleDateString()}</td>
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
                      {booking.status === 'PENDING' && (
                        <div className="flex items-center gap-4">
                          <form action={updateBookingStatus}>
                            <input type="hidden" name="bookingId" value={booking.id.toString()} />
                            <input type="hidden" name="status" value="CONFIRMED" />
                            <button type="submit" className="text-green-600 hover:text-green-900">Confirm</button>
                          </form>
                          <form action={updateBookingStatus}>
                            <input type="hidden" name="bookingId" value={booking.id.toString()} />
                            <input type="hidden" name="status" value="CANCELLED" />
                            <button type="submit" className="text-red-600 hover:text-red-900">Cancel</button>
                          </form>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">You have not received any booking requests yet.</p>
      )}
    </div>
  );
}