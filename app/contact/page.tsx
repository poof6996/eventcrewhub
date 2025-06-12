import React from 'react';

export default function ContactPage() {
  return (
    <main className="p-8 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4">Contact Our Experts</h1>
      <p className="mb-4 text-gray-700">Need advice or have bespoke requirements? Our team is here to help you plan the perfect event.</p> 
      <form className="space-y-4">
        <input type="text" placeholder="Your Name" className="w-full p-2 border rounded" />
        <input type="email" placeholder="Email Address" className="w-full p-2 border rounded" />
        <textarea placeholder="How can we help you?" className="w-full p-2 border rounded min-h-[100px]" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Send Message</button>
      </form>
      <div className="mt-6 text-sm text-gray-500">
        Or email us at <a href="mailto:help@eventcrewhub.com" className="underline text-blue-700">help@eventcrewhub.com</a>
      </div>
    </main>
  );
}
