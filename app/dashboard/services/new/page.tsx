import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { FilePlus } from "lucide-react";

export default async function MyServicesPage() {
    const session = await auth();
    if (!session?.user) return null;

    const supplierProfile = await prisma.supplier.findUnique({
        where: { userId: session.user.id }
    });
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Your Service</h1>
                {supplierProfile && (
                     <Link href={`/dashboard/services/${supplierProfile.id}/edit`} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        Edit Service
                    </Link>
                )}
            </div>

            {supplierProfile ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="relative h-40 w-full sm:w-1/3 rounded-lg overflow-hidden">
                            <Image src={supplierProfile.imageUrl || '/default-image.jpg'} alt={supplierProfile.name} fill style={{objectFit: 'cover'}} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">{supplierProfile.name}</h2>
                            <p className="text-gray-500">{supplierProfile.category}</p>
                            <p className="mt-4 text-gray-700">{supplierProfile.description}</p>
                        </div>
                    </div>
                </div>
            ) : (
                 <Link href="/dashboard/services/new" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col items-center justify-center text-center border-2 border-dashed">
                    <FilePlus className="h-10 w-10 text-gray-400 mb-3" />
                    <h3 className="text-lg font-bold">Create Your Service Profile</h3>
                    <p className="text-sm text-gray-500">Get started by listing your service.</p>
                </Link>
            )}
        </div>
    )
}