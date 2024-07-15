import { NextAuthOptions } from "next-auth";

import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/db/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      async profile(profile, tokens) {
        await dbConnect();
        try {
          const existingUser = await UserModel.findOne({
            email: profile.email,
          });
          if (existingUser) return existingUser;
          const user = await UserModel.create({
            email: profile.email,
            username: profile.login + Date.now().toString(),
            image: profile.avatar_url,
            isVerified: true,
            password: profile.login,
            createdAt: Date.now(),
            Otp: Math.floor(100000 + Math.random() * 900000).toString(),
            OtpExpiry: new Date(Date.now() + 10 * 60 * 1000),
          });
          return Promise.resolve(user) as any;
        } catch (err) {
          return Promise.reject(err) as any;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      async profile(profile, tokens) {
        await dbConnect();
        try {
          const existingUser = await UserModel.findOne({
            email: profile.email,
          });
          if (existingUser) return existingUser;
          const user = await UserModel.create({
            email: profile.email,
            username: profile.name.replace(/\s/g, "") + Date.now().toString(),
            image: profile.picture,
            isVerified: true,
            password: profile.name.replace(/\s/g, ""),
            createdAt: Date.now(),
            Otp: Math.floor(100000 + Math.random() * 900000).toString(),
            OtpExpiry: new Date(Date.now() + 10 * 60 * 1000),
          });
          return Promise.resolve(user) as any;
        } catch (err) {
          return Promise.reject(err) as any;
        }
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const existingUser = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!existingUser) {
            throw new Error("User not found");
          }
          if (!existingUser.isVerified) {
            throw new Error(
              "User is not verified. Please verify your email before login."
            );
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return existingUser;
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.email = user.email;
        token.image = user?.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.image = token.image;
      }
      return session;
    },
  },
};
