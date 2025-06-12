import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Briefcase, CalendarCheck, Star } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'SUPPLIER') return null;

  // Fetch all necessary data in one go
  const supplierData = await prisma.supplier.findUnique({
    where: { userId: session.user.id },
    include: {
      bookings: true, // Include bookings to get a count
      Review: { // Include reviews to get a count
        select: { id: true }
      },
    }
  });

  const totalBookings = supplierData?.bookings.length || 0;
  const pendingBookings = supplierData?.bookings.filter(b => b.status === 'PENDING').length || 0;
  const totalReviews = supplierData?.Review.length || 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-gray-600">Here's a summary of your activity.</p>
      </div>

      {/* --- Key Metric Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold">{totalBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
           <div className="flex items-center">
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="text-2xl font-bold">{pendingBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
           <div className="flex items-center">
            <div className="bg-green-100 text-green-600 p-3 rounded-full">
              <Star className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Reviews</p>
              <p className="text-2xl font-bold">{totalReviews}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Next Steps</h2>
          <p className="text-gray-600">Use the menu on the left to manage your services, view booking details, and respond to messages.</p>
      </div>
    </div>
  );
}