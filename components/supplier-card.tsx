import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

// This interface should match your Prisma schema
// If you get type errors, ensure these types match the 'Supplier' model in 'schema.prisma'
export interface Supplier {
  id: number; // Changed from string to number to match the database
  name: string;
  category: string;
  description: string | null;
  imageUrl: string | null;
  rating: number | null;
  reviews: number | null;
}

interface SupplierCardProps {
  supplier: Supplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  // The entire card is wrapped in this Link component
  return (
    <Link href={`/supplier/${supplier.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl">
        <div className="relative h-48">
          <Image
            src={supplier.imageUrl || '/default-image.jpg'} // Provide a fallback image
            alt={`Image of ${supplier.name}`}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500">{supplier.category}</p>
          <h3 className="text-lg font-bold truncate">{supplier.name}</h3>
          <p className="text-sm text-gray-600 h-10 overflow-hidden">
            {supplier.description}
          </p>
          <div className="flex items-center mt-4">
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <span className="text-gray-700 font-bold ml-1">{String(supplier.rating)}</span>
            <span className="text-gray-500 ml-2">({supplier.reviews} reviews)</span>
          </div>
        </div>
      </div>
    </Link>
  );
}