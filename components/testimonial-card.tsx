import { Star } from 'lucide-react';
import type { Review, User } from '@prisma/client';

interface TestimonialCardProps {
  review: Review & { author: User };
}

export function TestimonialCard({ review }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
      <div className="flex-grow">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < review.rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="mt-4 text-gray-600 italic">"{review.comment}"</p>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="font-semibold text-gray-800">{review.author.name}</p>
        <p className="text-sm text-gray-500">Customer</p>
      </div>
    </div>
  );
}