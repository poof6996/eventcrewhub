import { Role } from '@prisma/client';
import NextAuth, { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      role: Role;
    } & DefaultSession['user'];
  }

  interface User {
    role: Role;
  }
}