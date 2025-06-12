import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// This Server Action handles sending a new message
async function sendMessageAction(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user) throw new Error("Authentication required.");

  const content = formData.get("content") as string;
  const conversationId = parseInt(formData.get("conversationId") as string);

  if (!content || !conversationId) {
    throw new Error("Content and conversation ID are required.");
  }
  
  // Security Check: Make sure the user is a participant of this conversation
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        { participantOneId: session.user.id },
        { participantTwoId: session.user.id },
      ]
    }
  });

  if (!conversation) {
    throw new Error("Conversation not found or you are not a participant.");
  }

  // Create the new message in the database
  await prisma.message.create({
    data: {
      content,
      conversationId,
      senderId: session.user.id,
    }
  });

  // Revalidate the path to show the new message instantly
  revalidatePath(`/messages/${conversationId}`);
}

export default async function ConversationPage({ params }: { params: { conversationId: string } }) {
  const session = await auth();
  if (!session?.user) notFound();

  const conversationId = parseInt(params.conversationId);

  // Fetch the conversation and all its messages, including the sender of each message
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        include: {
          sender: true,
        },
        orderBy: {
          createdAt: 'asc', // Show oldest messages first
        }
      },
      // Also include the participants' details
      participantOne: true,
      participantTwo: true,
    }
  });

  // Security Check: If conversation doesn't exist, or if the current user is not a participant, show a 404
  if (!conversation || (conversation.participantOneId !== session.user.id && conversation.participantTwoId !== session.user.id)) {
    notFound();
  }

  // Determine who the "other user" is in the conversation
  const otherParticipant = conversation.participantOneId === session.user.id
    ? conversation.participantTwo
    : conversation.participantOne;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Conversation with {otherParticipant.name}</h1>
      
      {/* Message History */}
      <div className="h-[60vh] bg-gray-50 p-4 rounded-lg overflow-y-auto flex flex-col gap-4 mb-6">
        {conversation.messages.map(message => (
          <div 
            key={message.id} 
            className={`p-3 rounded-lg max-w-lg ${
              message.senderId === session.user.id
                ? 'bg-blue-500 text-white self-end' // Current user's messages
                : 'bg-white shadow-sm self-start' // Other user's messages
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <p className={`text-xs mt-1 ${
              message.senderId === session.user.id ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {new Date(message.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      {/* Send Message Form */}
      <form action={sendMessageAction}>
        <input type="hidden" name="conversationId" value={conversation.id} />
        <div className="flex items-center">
          <input
            type="text"
            name="content"
            className="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Type your message..."
            required
            autoComplete="off"
          />
          <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-r-lg hover:bg-blue-700">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}