import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from './lib/prisma';
import bcryptjs from 'bcryptjs';
 
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },

  callbacks: {
    jwt( { token, user} ) {
      if ( user ) {
        token.data = user;
      }
      return token;
    },

    // session({ session, token, user }) {
    session({ session, token }) {
      // console.log('Session callback:', { session, token, user });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token.data as any;
      return session;
    },

    // authorized({ auth, request: { nextUrl } }) {
    authorized({ auth, request: {  } }) {
      console.log("auth: ", { auth });
      // const isLoggedIn = !!auth?.user;
      // const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      // if (isOnDashboard) {
      //   if (isLoggedIn) return true;
      //   return false; // Redirect unauthenticated users to login page
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/dashboard', nextUrl));
      // }
      return true;
    },
  },
  providers: [
    // ... other providers ...
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

          if ( parsedCredentials.success === false ) {
            return null;
          }

          const { email, password } = parsedCredentials.data;

          // Buscar el correo
          const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

          if (!user) return null;
          
          // Comparar las contraseñas
          if ( bcryptjs.compareSync(password, user.password) === false ) return null;

          // Si las credenciales son válidas, retornar el usuario
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _, ...rest } = user;


          // console.log('User authenticated:', rest);
          return rest;
      },
    }),
  ]
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);