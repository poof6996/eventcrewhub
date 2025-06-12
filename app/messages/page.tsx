import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function MessagesDashboardPage() {
  const session = await auth();
  if (!session?.user) notFound();

  // FIX: Get the user ID from the session. It may be a string, so we will parse it.
  const userId = parseInt(session.user.id);

  // Fetch all conversations where the current user is a participant
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        // Use the parsed numeric userId in the query
        { participantOneId: userId },
        { participantTwoId: userId },
      ],
    },
    include: {
      participantOne: true, // Include details of the first user
      participantTwo: true, // Include details of the second user
    },
    orderBy: {
      updatedAt: 'desc', // Show most recent conversations first
    },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Your Conversations</h1>
      <div className="bg-white rounded-lg shadow-md">
        {conversations.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {conversations.map(convo => {
              // Determine who the "other" participant is
              const otherParticipant = convo.participantOneId === userId
                ? convo.participantTwo
                : convo.participantOne;

              return (
                <li key={convo.id}>
                  <Link href={`/messages/${convo.id}`} className="block p-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-12 w-12">
                         {/* We can add profile pictures here later */}
                        <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-lg font-semibold text-gray-600">
                            {otherParticipant.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{otherParticipant.name}</p>
                        <p className="text-sm text-gray-500">Click to view conversation</p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="p-6 text-gray-500">You have no conversations yet.</p>
        )}
      </div>
    </div>
  );
}