import { SupplierCard } from '@/components/supplier-card';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

// The page component now accepts a 'searchParams' prop
export default async function BrowsePage({
  searchParams,
}: {
  searchParams?: { search?: string };
}) {
  const searchQuery = searchParams?.search || '';

  // Define the 'where' clause for our Prisma query based on the search term
  const whereClause: Prisma.SupplierWhereInput = searchQuery
    ? {
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            category: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      }
    : {}; // If no search query, the 'where' clause is empty

  // Fetch suppliers from the database using the where clause
  const suppliers = await prisma.supplier.findMany({
    where: whereClause,
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">
        {searchQuery ? `Results for "${searchQuery}"` : 'Explore Our Services'}
      </h1>
      
      {suppliers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suppliers.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No services found matching your search.</p>
      )}
    </div>
  );
}