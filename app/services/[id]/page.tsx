import React from 'react';

const mockService = {
  id: 1,
  name: 'Live Jazz Band',
  description: 'Bring your party to life with a top-rated jazz band. Includes 3 hours of live music, setup, and sound equipment.',
  price: 500,
  images: ['/file.svg', '/globe.svg'],
  available: true,
  reviews: [
    { name: 'Sophie R.', text: 'The band was incredible! Highly recommend.' },
    { name: 'Alex P.', text: 'Professional and fun, made our night special.' },
  ],
};

export default function ServiceDetailPage() {
  return (
    <main className="p-4 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-6 mb-6">
        <div className="flex-1">
          <img src={mockService.images[0]} alt={mockService.name} className="w-full h-48 object-contain bg-gray-100 rounded mb-2" />
          <img src={mockService.images[1]} alt={mockService.name} className="w-full h-32 object-contain bg-gray-50 rounded" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{mockService.name}</h1>
          <p className="mb-2 text-gray-700">{mockService.description}</p>
          <span className="block font-bold text-blue-700 mb-2">from £{mockService.price}</span>
          <span className={mockService.available ? 'text-green-600' : 'text-red-600'}>
            {mockService.available ? 'Available' : 'Unavailable'}
          </span>
          <form className="mt-4 space-y-2 bg-gray-50 p-4 rounded">
            <label className="block font-semibold">Date</label>
            <input type="date" className="w-full p-2 border rounded" />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Book Now</button>
          </form>
        </div>
      </div>
      <section>
        <h2 className="text-xl font-bold mb-2">Customer Reviews</h2>
        <ul className="space-y-2">
          {mockService.reviews.map((r, i) => (
            <li key={i} className="bg-white rounded shadow p-3">
              <p className="mb-1">“{r.text}”</p>
              <span className="text-sm text-gray-500">— {r.name}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
