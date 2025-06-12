import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createHash } from "crypto";

async function requestPasswordResetAction(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  if (!email) {
    // Handle case where email is not provided
    redirect('/forgot-password?error=true');
    return;
  }
  
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // IMPORTANT: For security, we do not reveal if the user was found or not.
  // We proceed as if the email was sent, preventing user enumeration attacks.
  if (user) {
    // 1. Generate a secure, random token
    const resetToken = createHash('sha256').update(Math.random().toString()).digest('hex');

    // 2. Hash the token before storing it in the database for security
    const hashedToken = createHash('sha256').update(resetToken).digest('hex');

    // 3. Set an expiration date (e.g., 10 minutes from now)
    const tokenExpires = new Date(Date.now() + 10 * 60 * 1000);

    // 4. Update the user record in the database
    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: hashedToken,
        passwordResetTokenExpires: tokenExpires,
      },
    });

    // 5. In a real application, you would send an email here.
    // For our development, we will log the reset link to the console.
    // The link must contain the UN-HASHED token.
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
    console.log("Password Reset Link for testing:", resetLink);
  }

  // 6. Redirect to the same page with a success message, regardless of whether the user was found.
  redirect('/forgot-password?status=success');
}

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Forgot Password</h1>

        {searchParams?.status === 'success' ? (
          <div className="text-center p-4 bg-green-100 text-green-800 rounded-md">
            <p>If an account with that email exists, a password reset link has been sent.</p>
            <p className="text-sm mt-2">(For testing, please check your server console for the link).</p>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-600 mb-6">
              Enter your email address, and we will send you a link to reset your password.
            </p>
            <form action={requestPasswordResetAction}>
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
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
              >
                Send Reset Link
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}