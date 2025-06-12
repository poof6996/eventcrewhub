import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase"; // Import our supabase client

async function updateServiceAction(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) throw new Error("Authentication required.");

  const serviceId = formData.get("serviceId") as string;
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const imageFile = formData.get("image") as File;

  let imageUrl: string | undefined = undefined;

  // Check if a new image file was uploaded
  if (imageFile && imageFile.size > 0) {
    // Create a unique file path to prevent overwriting
    const filePath = `public/${session.user.id}-${Date.now()}-${imageFile.name}`;

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("service-images")
      .upload(filePath, imageFile);

    if (uploadError) {
      // Handle the upload error
      throw new Error("Failed to upload image.");
    }

    // Get the public URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from("service-images")
      .getPublicUrl(filePath);
    
    imageUrl = urlData.publicUrl;
  }

  // Build the data object for Prisma, only including imageUrl if it was updated
  const dataToUpdate: { name: string, category: string, description: string, imageUrl?: string } = {
    name,
    category,
    description,
  };

  if (imageUrl) {
    dataToUpdate.imageUrl = imageUrl;
  }

  // Update the supplier record in our database
  await prisma.supplier.updateMany({
    where: {
      id: parseInt(serviceId),
      userId: session.user.id, // Security check
    },
    data: dataToUpdate,
  });

  revalidatePath("/dashboard");
  revalidatePath(`/supplier/${serviceId}`);
  redirect("/dashboard");
}

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const session = await auth();
  const serviceId = parseInt(params.id);

  const service = await prisma.supplier.findUnique({
    where: { id: serviceId },
  });

  if (!service || service.userId !== session?.user?.id) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Edit Service</h1>
      {/* Add enctype for file uploads */}
      <form action={updateServiceAction} encType="multipart/form-data" className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <input type="hidden" name="serviceId" value={service.id} />
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Service Name</label>
          <input type="text" id="name" name="name" className="w-full px-3 py-2 border rounded-lg" defaultValue={service.name} required />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-bold mb-2">Category</label>
          <input type="text" id="category" name="category" className="w-full px-3 py-2 border rounded-lg" defaultValue={service.category} required />
        </div>
        {/* New Image Upload Section */}
        <div className="mb-6">
          <label htmlFor="image" className="block text-gray-700 font-bold mb-2">Service Image</label>
          {service.imageUrl && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">Current Image:</p>
              <Image src={service.imageUrl} alt="Current service image" width={200} height={200} className="rounded-lg mt-2" />
            </div>
          )}
          <input type="file" id="image" name="image" accept="image/png, image/jpeg" className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          <p className="text-xs text-gray-500 mt-1">Leave blank to keep the current image.</p>
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
          <textarea id="description" name="description" rows={4} className="w-full px-3 py-2 border rounded-lg" defaultValue={service.description || ''} required />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}