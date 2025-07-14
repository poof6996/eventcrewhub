// app/categories/page.tsx

import Link from 'next/link';
import prisma from '@/lib/prisma';

// The page is now an async function to allow for data fetching
export default async function CategoriesPage() {
  
  // Fetch categories from the database within a try/catch block for error handling
  let categories = [];
  try {
    categories = await prisma.category.findMany();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    // You can render an error message to the user if fetching fails
    return <p className="text-center text-red-500">Could not load categories. Please try again later.</p>;
  }

  return (
    <div className="bg-white">
      <div className="py-16 sm:py-24 xl:mx-auto xl:max-w-7xl xl:px-8">
        <div className="px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-0">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Browse by Category</h2>
          <Link href="/browse" className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
            Browse all suppliers
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        <div className="mt-4 flow-root">
          <div className="-my-2">
            <div className="relative box-content h-80 overflow-x-auto py-2 xl:overflow-visible">
              {/* Check if there are categories to display */}
              {categories.length > 0 ? (
                <div className="min-w-screen-xl absolute flex space-x-8 px-4 sm:px-6 lg:px-8 xl:relative xl:grid xl:grid-cols-5 xl:gap-x-8 xl:space-x-0 xl:px-0">
                  {/* Map over the dynamic categories from the database */}
                  {categories.map((category) => (
                    <Link
                      key={category.id} // Use the unique ID from the database as the key
                      // Link to the browse page with a query parameter for the category
                      href={`/browse?category=${encodeURIComponent(category.name)}`}
                      className="relative flex h-80 w-56 flex-col overflow-hidden rounded-lg p-6 hover:opacity-75 xl:w-auto"
                    >
                      <span aria-hidden="true" className="absolute inset-0">
                        {/* The image source remains dynamic based on the category name */}
                        <img src={`https://source.unsplash.com/featured/?${category.name},event`} alt="" className="h-full w-full object-cover object-center" />
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                      />
                      <span className="relative mt-auto text-center text-xl font-bold text-white">{category.name}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                // Display a message if no categories are found in the database
                <div className="text-center w-full py-10">
                  <p>No categories found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 px-4 sm:hidden">
          <Link href="/browse" className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            Browse all suppliers
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}