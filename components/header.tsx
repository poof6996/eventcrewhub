import Link from 'next/link';
import { auth, signOut } from '@/auth';

export async function Header() {
  const session = await auth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          EventCrewHub
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/browse" className="text-gray-600 hover:text-gray-900">
            Browse Services
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-4">
              {session.user.role === 'SUPPLIER' && (
                 <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              )}
               {session.user.role === 'CUSTOMER' && (
                 <Link href="/my-bookings" className="text-gray-600 hover:text-gray-900">My Bookings</Link>
              )}
              <Link href="/messages" className="text-gray-600 hover:text-gray-900">
                Messages
              </Link>
              <span className="text-gray-700">Hello, {session.user.name}</span>
              <form
                action={async () => {
                  'use server';
                  await signOut();
                }}
              >
                <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <>
              <Link href="/register-supplier" className="text-gray-600 hover:text-gray-900">
                For Suppliers
              </Link>
              <Link href="/register" className="text-gray-600 hover:text-gray-900">
                Sign Up
              </Link>
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Sign In
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}