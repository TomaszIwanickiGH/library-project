// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcrypt';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectToDatabase();

        // Znajdź użytkownika w bazie danych
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error('No user found with the email');
        }

        // Sprawdź hasło
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error('Invalid password');
        }

        // Zwróć dane użytkownika
        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
