import React from 'react';

const mockServices = [
  {
    id: 1,
    name: 'Live Jazz Band',
    description: 'Top-rated jazz band for weddings and parties.',
    price: 500,
    available: true,
    image: '/file.svg',
  },
  {
    id: 2,
    name: 'Gourmet Catering',
    description: 'Custom menus for every event.', 
    price: 20,
    available: false,
    image: '/globe.svg',
  },
  {
    id: 3,
    name: 'Photo Booth',
    description: 'Fun photo booth with props.',
    price: 250,
    available: true,
    image: '/window.svg',
  },
];

export default function SearchPage() {
  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Browse Party Services</h1>
      <form className="flex flex-col sm:flex-row gap-2 mb-6">
        <input type="text" placeholder="Search services..." className="flex-1 p-2 border rounded" />
        <select className="p-2 border rounded">
          <option>All Categories</option>
          <option>Music & Bands</option>
          <option>Catering</option>
          <option>Photography</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Filter</button>
      </form>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockServices.map((service) => (
          <li key={service.id} className="bg-white rounded shadow p-4 flex flex-col sm:flex-row items-center gap-4">
            <img src={service.image} alt={service.name} className="w-16 h-16" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{service.name}</h2>
              <p className="text-gray-600">{service.description}</p>
              <span className="block font-bold text-blue-700 mt-2">{service.price ? `from £${service.price}` : 'Contact for price'}</span>
              <span className={service.available ? 'text-green-600' : 'text-red-600'}>
                {service.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <a href={`/services/${service.id}`} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 sm:mt-0">View</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
