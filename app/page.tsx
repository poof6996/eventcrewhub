import { prisma } from '@/lib/prisma';
import { Search, Calendar, MapPin, Users } from 'lucide-react';
import { SupplierCard } from '@/components/supplier-card';
import { TestimonialCard } from '@/components/testimonial-card';
import Link from 'next/link';

export default async function HomePage() {
  // Fetch a few suppliers to feature (e.g., the first 4)
  const featuredServices = await prisma.supplier.findMany({
    take: 4,
  });

  // Fetch a few top-rated reviews to display as testimonials
  const testimonials = await prisma.review.findMany({
    where: {
      rating: { gte: 4 }, // Get reviews with 4 stars or more
      comment: { not: null }, // Ensure the review has a comment
    },
    take: 3,
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 leading-tight">
            Find The Perfect Services For Your Event
          </h1>
          <p className="mt-4 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Get instant quotes, check availability, and book everything you need for your next unforgettable event, all in one place.
          </p>
          
          {/* Advanced Search Bar */}
          <div className="mt-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-white p-4 rounded-lg shadow-lg border border-neutral-100">
              <div className="relative col-span-1 md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input type="text" placeholder="Service (e.g., 'wedding DJ')" className="w-full h-full pl-10 pr-4 py-3 border border-neutral-200 rounded-md focus:outline-blue-500" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input type="text" placeholder="Location" className="w-full h-full pl-10 pr-4 py-3 border border-neutral-200 rounded-md focus:outline-blue-500" />
              </div>
              <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      {featuredServices.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-10">Featured Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredServices.map(service => (
              <SupplierCard key={service.id} supplier={service} />
            ))}
          </div>
        </section>
      )}

      {/* Customer Reviews/Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map(review => (
                <TestimonialCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call-to-Action Footer Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-blue-600 text-white p-10 rounded-lg text-center shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Next Event?</h2>
          <p className="max-w-2xl mx-auto mb-8">Whether you're looking for the perfect vendor or you're a vendor looking to grow your business, EventCrewHub is here for you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-neutral-100 transition-colors">
              Find Services
            </Link>
            <Link href="/register-supplier" className="bg-blue-700 border border-blue-500 font-bold py-3 px-8 rounded-full hover:bg-blue-800 transition-colors">
              Become a Supplier
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}