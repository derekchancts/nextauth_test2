import NextAuth from 'next-auth'
import EmailProvider from "next-auth/providers/email";

import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import Auth0Provider from "next-auth/providers/auth0";

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from '../../../lib/mongodb'
import connectDB from '../../../config/connectDB';

import CredentialsProvider from "next-auth/providers/credentials";
// import connectDB from '../../../config/connectDB';
import Users from '../../../models/userModel';
import bcrypt from 'bcrypt';

connectDB();



export default NextAuth({ 
  providers: [
    // EmailProvider({
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: process.env.EMAIL_SERVER_PORT,
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER,
    //       pass: process.env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    // }),
    GoogleProvider({
      // clientId: process.env.GOOGLE_CLIENT_ID,
      // clientSecret: process.env.GOOGLE_CLIENT_SECRET
      clientId: process.env.GOOGLE_CLIENT_IDw,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    // Auth0Provider({
    //   clientId: process.env.AUTH0_CLIENT_ID,
    //   clientSecret: process.env.AUTH0_CLIENT_SECRET,
    //   issuer: process.env.AUTH0_ISSUER
    // }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // const email = credentials.email;
        // const password = credentials.password;
        const { email, password } = credentials;
        // console.log({email})
        // console.log({password})

        const user = await Users.findOne({ email });
        if (!user) throw new Error("You haven't registered yet");
        if (user) return signInUser({ password, user });
      }
    })
  ],
  pages: {
    signIn: "/signin"
  },
  adapter: MongoDBAdapter(clientPromise),
  database: {
    type: "mongodb",
    useNewUrlParser: true,
    url: process.env.MONGODB_URL,
  },

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT
  
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true
  },
  jwt: {
    secret: process.env.JWT_PRIVATE_KEY,
    encryption: true
  },
})


const signInUser = async ({ password, user }) => {
  if (!password || password === "undefined") throw new Error("Please enter password")
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Password not correct");
  // if matched, then return the user
  return user;
}