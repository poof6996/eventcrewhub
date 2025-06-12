import React from 'react';

const categories = [
	{
		name: 'Music & Bands',
		description: 'Live bands, DJs, and musicians for every event.',
		icon: '/file.svg',
	},
	{
		name: 'Catering',
		description: 'Gourmet food, drinks, and desserts.',
		icon: '/globe.svg',
	},
	{
		name: 'Photography',
		description: 'Professional photographers and photo booths.',
		icon: '/window.svg',
	},
	{
		name: 'Entertainers',
		description: 'Magicians, dancers, comedians, and more.',
		icon: '/vercel.svg',
	},
	{
		name: 'Venues',
		description: 'Unique spaces for every occasion.',
		icon: '/next.svg',
	},
];

export default function CategoriesPage() {
	return (
		<main className="p-8 max-w-5xl mx-auto">
			<h1 className="text-4xl font-bold mb-4 text-center">
				Event Categories
			</h1>
			<p className="mb-8 text-lg text-center text-gray-600">
				Discover top-rated suppliers and services for every type of event.
			</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
				{categories.map((cat, i) => (
					<div
						key={i}
						className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center group cursor-pointer"
					>
						<img
							src={cat.icon}
							alt={cat.name}
							className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform drop-shadow-md"
						/>
						<h2 className="text-xl font-semibold mb-2 group-hover:text-blue-700 transition-colors">
							{cat.name}
						</h2>
						<p className="text-gray-500 mb-2 group-hover:text-gray-700 transition-colors">
							{cat.description}
						</p>
						<a
							href="/register?supplier=true"
							className="mt-2 text-blue-600 font-medium underline hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition"
							aria-label={`Become a supplier in ${cat.name}`}
						>
							Become a Supplier
						</a>
						{/* Micro-interaction: feedback on click */}
						<span className="hidden group-active:inline-block text-green-600 text-sm mt-1">
							Thank you for your interest!
						</span>
					</div>
				))}
			</div>
			<div className="bg-blue-50 rounded-xl p-8 text-center mt-8 animate-fade-in">
				<h2 className="text-2xl font-bold mb-2">
					Are you a customer or supplier?
				</h2>
				<p className="mb-4 text-gray-700">
					Join our platform to book amazing services or grow your business.
				</p>
				<div className="flex flex-col sm:flex-row justify-center gap-4">
					<a
						href="/register?customer=true"
						className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
					>
						Register as Customer
					</a>
					<a
						href="/register?supplier=true"
						className="bg-white border border-blue-600 text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
					>
						Register as Supplier 
					</a>
				</div>
			</div>
		</main>
	);
}
