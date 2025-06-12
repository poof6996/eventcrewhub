import React from 'react';

export default function AuthPage() {
  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Sign In / Register</h1>
      <form className="space-y-4 mb-6">
        <input type="email" placeholder="Email Address" className="w-full p-2 border rounded" />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Sign In</button>
      </form>
      <div className="text-center text-sm text-gray-600">
        Don&apos;t have an account? <a href="#" className="text-blue-700 underline">Register</a>
      </div>
    </main>
  );
}
