import { signIn } from "@/auth";
import Link from "next/link";

export default function SupplierLoginPage() {
  async function handleLogin(formData: FormData) {
    "use server";
    await signIn("credentials", formData, { redirectTo: "/dashboard" });
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Supplier Sign In</h1>
        <p className="text-center text-gray-600 mb-6">Access your supplier dashboard.</p>
        <form action={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <input type="email" id="email" name="email" className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <input type="password" id="password" name="password" className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">
            Sign In to Dashboard
          </button>
        </form>
         <p className="text-center text-sm text-gray-600 mt-4">
          Need a supplier account?{' '}
          <Link href="/register-supplier" className="font-semibold text-green-600 hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}