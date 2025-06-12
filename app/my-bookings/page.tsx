import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ToastHandler } from "@/components/toast-handler";
import { SupplierCard } from "@/components/supplier-card";
import { Calendar, Heart, PlusCircle } from "lucide-react";
import type { Booking, Supplier } from "@prisma/client";

// Define the type for our booking data, including the nested supplier
type BookingWithSupplier = Booking & { supplier: Supplier };

// A new component for displaying a list of bookings
function BookingsList({ title, bookings }: { title: string, bookings: BookingWithSupplier[] }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                {title}
            </h2>
            {bookings.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {bookings.map(booking => (
                        <li key={booking.id} className="py-3 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{booking.supplier.name}</p>
                                <p className="text-sm text-gray-500">{new Date(booking.eventDate).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                booking.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                {booking.status}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No bookings found in this category.</p>
            )}
        </div>
    );
}

export default async function CustomerDashboardPage() {
  const session = await auth();
  if (!session?.user) notFound();

  // Fetch all user data in one go: bookings and saved suppliers
  const userData = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
    include: {
      bookings: {
        include: { supplier: true },
        orderBy: { eventDate: 'desc' },
      },
      savedSuppliers: true,
    },
  });

  if (!userData) notFound();

  const now = new Date();
  const upcomingBookings = userData.bookings.filter(b => b.eventDate >= now);
  const pastEvents = userData.bookings.filter(b => b.eventDate < now);
  const savedSuppliers = userData.savedSuppliers;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToastHandler />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">My Dashboard</h1>
        <p className="text-xl mb-8 text-gray-600">
          Welcome back, {session.user.name}! Manage your events and favorite services here.
        </p>

        {/* --- Card-based Grid Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- Main Column --- */}
            <div className="lg:col-span-2 space-y-8">
                <BookingsList title="Upcoming Bookings" bookings={upcomingBookings} />
                <BookingsList title="Past Events" bookings={pastEvents} />
            </div>

            {/* --- Right Sidebar Column --- */}
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Heart className="h-6 w-6 text-red-500"/>
                        Saved Services
                    </h2>
                    {savedSuppliers.length > 0 ? (
                        <div className="space-y-4">
                            {savedSuppliers.map(supplier => (
                                <Link key={supplier.id} href={`/supplier/${supplier.id}`} className="block p-3 rounded-md hover:bg-gray-50">
                                    <p className="font-semibold">{supplier.name}</p>
                                    <p className="text-sm text-gray-500">{supplier.category}</p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">You haven't saved any services yet.</p>
                    )}
                </div>

                {/* --- CTA Card --- */}
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                     <PlusCircle className="h-10 w-10 text-blue-600 mx-auto mb-3"/>
                     <h2 className="text-xl font-bold mb-2">Ready to Plan?</h2>
                     <p className="text-gray-600 mb-4">Find and book the perfect services for your next event.</p>
                     <Link