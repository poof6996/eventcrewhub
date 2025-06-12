import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { FilePlus } from "lucide-react";

export default async function MyServicesPage() {
    const session = await auth();
    if (!session?.user) return null;

    // We find the single service profile linked to the user
    const supplierProfile = await prisma.supplier.findUnique({
        where: { userId: session.user.id }
    });
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Your Service</h1>
                {/* Show Edit button only if a profile exists */}
                {supplierProfile && (
                     <Link href={`/dashboard/services/${supplierProfile.id}/edit`} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        Edit Service
                    </Link>
                )}
            </div>

            {supplierProfile ? (
                // Display the service card if it exists
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="relative h-40 w-full sm:w-1/3 rounded-lg overflow-hidden bg-gray-100">
                            <Image 
                                src={supplierProfile.imageUrl || '/default-image.jpg'} 
                                alt={supplierProfile.name} 
                                fill 
                                style={{objectFit: 'cover'}} 
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">{supplierProfile.name}</h2>
                            <p className="text-gray-500 mb-2">{supplierProfile.category}</p>
                            <p className="mt-4 text-gray-700">{supplierProfile.description}</p>
                            {/* We can add pricing info here later */}
                        </div>
                    </div>
                </div>
            ) : (
                // Show a prompt to create a profile if one doesn't exist
                 <Link href="/dashboard/services/new" className="bg-white p-10 rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col items-center justify-center text-center border-2 border-dashed">
                    <FilePlus className="h-10 w-10 text-gray-400 mb-3" />
                    <h3 className="text-lg font-bold">Create Your Service Profile</h3>
                    <p className="text-sm text-gray-500">Get started by listing your service.</p>
                </Link>
            )}
        </div>
    )
}