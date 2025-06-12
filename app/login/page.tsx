import { signIn } from "@/auth";
import Link from "next/link";
import { AuthError } from "next-auth";

// This is the updated Server Action
async function handleLogin(formData: FormData) {
  "use server";
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      // Redirect back to the login page with an error query param
      return redirect("/login?error=InvalidCredentials");
    }
    // For other errors, you might want to handle them differently
    throw error;
  }
}

// The page component now reads the error from the URL
export default function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Customer Sign In</h1>
        <p className="text-center text-gray-600 mb-6">Access your bookings and messages.</p>
        
        {/* Display an error message if the URL contains error=InvalidCredentials */}
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
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Need an account?{' '}
          <Link href="/register" className="font-semibold text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}