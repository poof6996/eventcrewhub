import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod"; // Import Zod

// Define the schema for our form using Zod
const ServiceSchema = z.object({
  name: z.string().min(3, { message: "Service name must be at least 3 characters long." }),
  category: z.string().min(1, { message: "Category is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long." }),
});

export default function NewServicePage() {

  async function createServiceAction(formData: FormData) {
    "use server";
    
    const session = await auth();
    if (!session || session.user.role !== 'SUPPLIER') {
      throw new Error("Unauthorized"); 
    }

    // Convert formData to a plain object
    const formObject = Object.fromEntries(formData.entries());

    // Validate the form data against the Zod schema
    const validated = ServiceSchema.safeParse(formObject);

    // If validation fails, handle the errors (in a real app, you'd return these to the form)
    if (!validated.success) {
      console.error("Validation failed:", validated.error.flatten().fieldErrors);
      // For now, we'll just throw an error. In a future step, we can display these errors on the form.
      throw new Error("Invalid form data provided.");
    }

    // If validation succeeds, use the validated data to create the service
    await prisma.supplier.create({
      data: {
        name: validated.data.name,
        category: validated.data.category,
        description: validated.data.description,
        userId: session.user.id,
      },
    });

    revalidatePath("/browse");
    revalidatePath("/dashboard/services"); // Revalidate the new services page
    redirect("/dashboard/services"); // Redirect to the new services page
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add a New Service</h1>
      <form action={createServiceAction} className="bg-white p-8 rounded-lg shadow-md w-full">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Service Name</label>
          <input type="text" id="name" name="name" className="w-full px-3 py-2 border rounded-lg" required />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-bold mb-2">Category</label>
          <input type="text" id="category" name="category" className="w-full px-3 py-2 border rounded-lg" required placeholder="e.g., Catering, Photography" />
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
          <textarea id="description" name="description" rows={4} className="w-full px-3 py-2 border rounded-lg" required />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
          Create Service
        </button>
      </form>
    </div>
  );
}