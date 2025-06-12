import { NextResponse } from 'next/server';

// Mock data for demonstration
const services = [
  { id: 1, name: 'Live Jazz Band', price: 500, available: true }, 
  { id: 2, name: 'Gourmet Catering', price: 20, available: false },
  { id: 3, name: 'Photo Booth', price: 250, available: true },
];

export async function GET() {
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  // Accept new service (mock, does not persist)
  const data = await request.json();
  return NextResponse.json({ message: 'Service created (mock)', data });
}
