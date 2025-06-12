import { signIn } from "@/auth";
import Link from "next/link";
import { AuthError } from "next-auth";

async function handleLogin(formData: FormData) {
  "use server";
  try {
    await signIn("credentials", formData, { redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      // Redirect back to this page with an error
      return redirect("/supplier-login?error=InvalidCredentials");
    }
    throw error;
  }
}

export default function SupplierLoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Supplier Sign In</h1>
        <p className="text-center text-gray-600 mb-6">Access your supplier dashboard.</p>
        
        {searchParams?.error === "InvalidCredentials" && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
            <strong className="font-bold">Login Failed!</strong>
            <span className="block sm:inline"> Invalid email or password.</span>
          </div>
        )}

        <form action={handleLogin}>
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