import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function submitReviewAction(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user) throw new Error("Authentication required");

  const bookingId = parseInt(formData.get("bookingId") as string);
  const rating = parseInt(formData.get("rating") as string);
  const comment = formData.get("comment") as string;

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      customerId: session.user.id,
      status: 'PAID', // A user should only review a paid-for service
    }
  });

  if (!booking) {
    throw new Error("Invalid booking or permission denied.");
  }
  
  await prisma.review.create({
    data: {
      rating,
      comment,
      authorId: session.user.id,
      supplierId: booking.supplierId,
    }
  });

  revalidatePath(`/supplier/${booking.supplierId}`);
  revalidatePath('/my-bookings');

  // UPDATED: Redirect back to the bookings page with a success flag
  redirect('/my-bookings?review_success=true');
}

export default async function LeaveReviewPage({ params }: { params: { bookingId: string } }) {
  const session = await auth();
  if (!session?.user) notFound();
  
  const bookingId = parseInt(params.bookingId);

  const booking = await prisma.booking.findFirst({
    where: { 
      id: bookingId,
      customerId: session.user.id,
      status: 'PAID' // Check for PAID status
    },
    include: {
      supplier: true,
    }
  });

  if (!booking) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">Leave a Review</h1>
      <p className="text-lg text-gray-600 mb-6">You are reviewing your booking with <span className="font-semibold">{booking.supplier.name}</span>.</p>
      
      <form action={submitReviewAction} className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <input type="hidden" name="bookingId" value={booking.id} />

        <div className="mb-6">
          <label htmlFor="rating" className="block text-gray-700 font-bold mb-2">Overall Rating</label>
          <div className="flex flex-row-reverse justify-end">
            {[5, 4, 3, 2, 1].map((star) => (
              <label key={star} className="cursor-pointer text-4xl text-gray-300 peer-hover:text-yellow-400 hover:text-yellow-400 has-[:checked]:text-yellow-400">
                <input type="radio" name="rating" value={star} className="hidden peer" required />
                ★
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="comment" className="block text-gray-700 font-bold mb-2">Your Review (optional)</label>
          <textarea id="comment" name="comment" rows={5} className="w-full px-3 py-2 border rounded-lg" placeholder="Share your experience..."></textarea>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
          Submit Review
        </button>
      </form>
    </div>
  );
}