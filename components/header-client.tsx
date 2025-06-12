"use client";

import Link from 'next/link';
import { useState } from 'react';
import type { Session } from 'next-auth';
import { Menu, X } from 'lucide-react';

interface HeaderClientProps {
  session: Session | null;
  signOutAction: () => Promise<void>;
}

// The 'export' keyword here is the crucial part that was likely missing.
export function HeaderClient({ session, signOutAction }: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800" onClick={closeMenu}>
          EventCrewHub
        </Link>

        {/* --- Desktop Navigation --- */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/browse" className="text-gray-600 hover:text-gray-900">Browse Services</Link>
          {session?.user ? (
            <div className="flex items-center gap-4">
              {session.user.role === 'SUPPLIER' && <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>}
              {session.user.role === 'CUSTOMER' && <Link href="/my-bookings" className="text-gray-600 hover:text-gray-900">My Bookings</Link>}
              <Link href="/messages" className="text-gray-600 hover:text-gray-900">Messages</Link>
              <form action={signOutAction}><button type="submit" className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Sign Out</button></form>
            </div>
          ) : (
            <>
              <Link href="/register-supplier" className="text-gray-600 hover:text-gray-900">For Suppliers</Link>
              <Link href="/register" className="text-gray-600 hover:text-gray-900">Sign Up</Link>
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Sign In</Link>
            </>
          )}
        </nav>

        {/* --- Hamburger Menu Button (Mobile) --- */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* --- Mobile Menu Overlay --- */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} >
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMenu}></div>
        <div className={`fixed top-0 right-0 h-full w-2/3 max-w-sm bg-white p-6 shadow-xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold">Menu</h2>
            <button onClick={closeMenu} aria-label="Close menu"><X className="h-6 w-6" /></button>
          </div>
          <nav className="flex flex-col space-y-4">
            <Link href="/browse" onClick={closeMenu} className="text-lg text-gray-700 hover:text-blue-600 py-2">Browse Services</Link>
             {session?.user ? (
              <>
                {session.user.role === 'SUPPLIER' && (<Link href="/dashboard" onClick={closeMenu} className="text-lg text-gray-700 hover:text-blue-600 py-2">Dashboard</Link>)}
                {session.user.role === 'CUSTOMER' && (<Link href="/my-bookings" onClick={closeMenu} className="text-lg text-gray-700 hover:text-blue-600 py-2">My Bookings</Link>)}
                <Link href="/messages" onClick={closeMenu} className="text-lg text-gray-700 hover:text-blue-600 py-2">Messages</Link>
                <form action={() => { signOutAction(); closeMenu(); }}>
                  <button type="submit" className="w-full text-left text-lg text-red-600 hover:text-red-800 py-2">Sign Out</button>
                </form>
              </>
            ) : (
              <>
                <hr className="my-2"/>
                <Link href="/register-supplier" onClick={closeMenu} className="text-lg text-gray-700 hover:text-blue-600 py-2">For Suppliers</Link>
                <Link href="/register" onClick={closeMenu} className="text-lg text-gray-700 hover:text-blue-600 py-2">Sign Up</Link>
                <Link href="/login" onClick={closeMenu} className="w-full mt-4 text-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700">Sign In</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}