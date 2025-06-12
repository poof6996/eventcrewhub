import { auth, signOut } from '@/auth';
import { HeaderClient } from './header-client';

export async function Header() {
  const session = await auth();

  // This server action will be passed down to the client component
  const signOutAction = async () => {
    'use server';
    await signOut();
  };
  
  return <HeaderClient session={session} signOutAction={signOutAction} />;
}