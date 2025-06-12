import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import Link from "next/link"; // Import Link

export default function RegisterSupplierPage() {
  async function registerSupplier(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      return;
    }
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log("User already exists");
      return;
    }
    
    const hashedPassword = await hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.SUPPLIER,
      },
    });

    // Redirect to the new supplier login page
    redirect("/supplier-login");
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Become a Supplier</h1>
        <p className="text-center text-gray-600 mb-6">Create an account to list your services.</p>
        <form action={registerSupplier}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
              Business or Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700"
          >
            Create Supplier Account
          </button>
        </form>
        {/* Added a link to the supplier login page */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have a supplier account?{' '}
          <Link href="/supplier-login" className="font-semibold text-green-600 hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}