import { NextResponse } from 'next/server';

// Mock data for demonstration
const users = [
  { id: 1, email: 'sophie@example.com', name: 'Sophie R.' },
];

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  // Accept new user (mock, does not persist)
  const data = await request.json();
  return NextResponse.json({ message: 'User created (mock)', data }); 
}
