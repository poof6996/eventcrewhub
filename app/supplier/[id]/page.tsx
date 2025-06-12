import Image from 'next/image';
import { Star, Heart } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import Link from 'next/link';
import { SaveSupplierButton } from '@/components/save-supplier-button';

// --- (All of your existing Server Actions remain here unchanged) ---
async function createBookingAction(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) throw new Error("You must be logged in to book a service.");
  const supplierId = parseInt(formData.get("supplierId") as string);
  const eventDate = new Date(formData.get("eventDate") as string);
  const guestCount = parseInt(formData.get("guestCount") as string);
  const message = formData.get("message") as string;
  await prisma.booking.create({
    data: { eventDate, guestCount, message, customerId: session.user.id, supplierId: supplierId },
  });
  redirect("/booking/success");
}

async function findOrCreateConversationAction(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) throw new Error("Authentication required.");
  const supplierUserId = parseInt(formData.get("supplierUserId") as string);
  const customerId = session.user.id;
  if (supplierUserId === customerId) throw new Error("You cannot start a conversation with yourself.");
  const existingConversation = await prisma.conversation.findFirst({
    where: { OR: [{ participantOneId: customerId, participantTwoId: supplierUserId },{ participantOneId: supplierUserId, participantTwoId: customerId }] }
  });
  if (existingConversation) { redirect(`/messages/${existingConversation.id}`); }
  const newConversation = await prisma.conversation.create({
    data: { participantOneId: customerId, participantTwoId: supplierUserId }
  });
  redirect(`/messages/${newConversation.id}`);
}


export default async function SupplierDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const supplierId = parseInt(params.id);

  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
    include: {
      Review: {
        include: { author: true },
        orderBy: { createdAt: 'desc' },
      },
      // Also fetch the users who have saved this supplier
      savedBy: {
        where: { id: session?.user?.id || 0 },
      }
    },
  });

  if (!supplier) {
    notFound();
  }
  
  // Check if the current logged-in user has saved this supplier
  const isSaved = supplier.savedBy.length > 0;

  // ... (average rating calculation remains the same)
  const reviews = supplier.Review || [];
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount
    : 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column: Image, Details, and Reviews */}
        <div className="md:col-span-2">
          {/* ... (Image section remains the same) ... */}
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
            <Image src={supplier.imageUrl || '/default-image.jpg'} alt={`Image of ${supplier.name}`} fill style={{ objectFit: 'cover' }}/>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold">{supplier.name}</h1>
              <p className="text-lg text-gray-500 mt-1">{supplier.category}</p>
            </div>
            {/* Add the SaveSupplierButton component here */}
            {session?.user && (
              <SaveSupplierButton supplierId={supplier.id} isInitiallySaved={isSaved} />
            )}
          </div>
          
          {/* ... (Rating, Description, and Reviews sections remain the same) ... */}
          <div className="flex items-center my-4">
            {reviewCount > 0 && (
              <>
                <Star className="h-6 w-6 text-yellow-500 fill-current" />
                <span className="text-gray-700 font-bold ml-1 text-lg">{averageRating.toFixed(1)}</span>
                <span className="text-gray-500 ml-2 text-lg">({reviewCount} reviews)</span>
              </>
            )}
          </div>
          <p className="text-gray-700 leading-relaxed mt-4">{supplier.description}</p>
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">Reviews</h2>
            {reviewCount > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">{[...Array(5)].map((_, i) => (<Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />))}</div>
                      <p className="ml-4 font-semibold text-gray-800">{review.author.name}</p>
                    </div>
                    {review.comment && <p className="text-gray-600">{review.comment}</p>}
                  </div>
                ))}
              </div>
            ) : (<p className="text-gray-500">No reviews yet.</p>)}
          </div>
        </div>

        {/* Right Column: Contact & Booking Form (remains the same) */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            {session?.user && session.user.id !== supplier.userId && (
              <><form action={findOrCreateConversationAction} className="mb-4"><input type="hidden" name="supplierUserId" value={supplier.userId} /><button type="submit" className="w-full bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-800">Contact Supplier</button></form><hr className="my-6" /></>
            )}
            <h2 className="text-2xl font-bold mb-4">Request a Quote</h2>
            {session?.user && session.user.role === 'CUSTOMER' ? (
              <form action={createBookingAction}>
                <input type="hidden" name="supplierId" value={supplier.id} />
                <div className="mb-4"><label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Event Date</label><input type="date" id="eventDate" name="eventDate" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required /></div>
                <div className="mb-4"><label htmlFor="guestCount" className="block text-sm font-medium text-gray-700">Number of Guests</label><input type="number" id="guestCount" name="guestCount" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required min="1" /></div>
                <div className="mb-4"><label htmlFor="message" className="block text-sm font-medium text-gray-700">Message (optional)</label><textarea id="message" name="message" rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Tell the supplier about your event..."></textarea></div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Send Request</button>
              </form>
            ) : (
              <div><p className="text-gray-600">You must be logged in as a customer to request a quote.</p>{!session?.user && (<Link href="/login" className="mt-4 inline-block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Log In or Sign Up</Link>)}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}