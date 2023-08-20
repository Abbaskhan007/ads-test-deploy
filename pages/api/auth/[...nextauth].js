import clientPromise from "../lib/mongodb";
import { randomUUID } from "uuid";
import { randomBytes } from "crypto";
import { v4 as uuid } from "uuid";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

function generateReferralId() {
  console.log("----------=-=-7777");
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function updateUserPermissions(email, referralId) {
  console.log("----------=-=-");
  const client = await clientPromise;
  const usersCollection = client.db().collection("users");
  const newApiKey = uuid();

  const userReferralId = generateReferralId();
  const result = await usersCollection.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      $set: {
        userData: {
          stripeData: [],
          referredBy: referralId ? referralId : "none",
          userReferralId,
          credits: 25,
          apiKey: newApiKey,
          favorites: [],
        },
      },
    }
  );

  if (result.ok) {
    console.log(`User with email ${email} updated successfully.`);
  } else {
    console.log(
      `User with email ${email} not found or already has permissions set.`
    );
  }
}

export default NextAuth({
  secret: process.env.SECRET, // Add the secret using environment variable

  providers: [
    GoogleProvider({
      clientId:
        "525840235038-bu2euhmid15h5b9l4vivfpjprj1uib93.apps.googleusercontent.com",
      clientSecret: "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",
    }),
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        const { email, password } = credentials;
        console.log("-=-=-=-=", email, password);
        const client = await clientPromise;
        const usersCollection = client.db().collection("users");
        console.log("-=-=-=-=-=", email.toLowerCase());
        const findUser = await usersCollection.findOne({
          email: email.toLowerCase(),
        });
        console.log("Find User", findUser);
        if (!findUser) {
          throw new Error("Incorrect Email and Password");
          // const { firstName, lastName, email, password, providerType } =
          //   credentials;
          // const newUser = {
          //   firstName,
          //   lastName,
          //   email,
          //   password,
          //   providerType,
          // };
          // usersCollection.insertOne(newUser, (err, user) => {
          //   if (err) {
          //     console.error("Error inserting user:", err);
          //     return null;
          //   }

          //   console.log("User inserted successfully:", user);
          //   return user;
          // });
        }
        if (findUser.password !== password) {
          throw new Error("Incorrect Email and Password");
        } else if (
          !findUser.userData.active &&
          Date.now() > findUser?.tokenExpiry
        ) {
          throw new Error(
            "Your Token has Expired. Please Create Account Again"
          );
        } else if (!findUser.userData.active) {
          throw new Error("Please Verify Your Account");
        }
        return findUser;
      },
    }),
  ],
  pages: {
    signIn: "/signIn",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      console.log("user in jwt", user);
      if (user) {
        token.id = user._id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.userData = user.userData;
      }

      return token;
    },
    session: ({ session, token }) => {
      console.log("Session", token);
      if (token) {
        session.id = token.id;
        session.firstName = token.firstName;
        session.lastName = token.lastName;
        session.email = token.email;
        session.userData = token.userData;
      }

      return session;
    },
  },
});

// // import clientPromise from "../lib/mongodb";

// // const insertDocument = async (collectionName, email, data) => {
// //   const client = await clientPromise;
// //   const collection = client.db().collection(collectionName);
// //   const result = await collection.updateOne(
// //     { email },
// //     { $set: data },
// //     { upsert: true }
// //   );
// //   console.log(
// //     `${result.matchedCount} document(s) matched the filter criteria.`
// //   );
// //   console.log(`${result.modifiedCount} document(s) were updated.`);
// //   console.log(`${result.upsertedCount} document(s) were upserted.`);
// // };

// export default NextAuth({
//   debug: true,
//   providers: [
//     // OAuth authentication providers...
//     // AppleProvider({
//     //   clientId: process.env.APPLE_ID,
//     //   clientSecret: process.env.APPLE_SECRET
//     // }),
//     // FacebookProvider({
//     //   clientId: process.env.FACEBOOK_ID,
//     //   clientSecret: process.env.FACEBOOK_SECRET
//     // }),
//     // GoogleProvider({
//     //   clientId: process.env.GOOGLE_ID,
//     //   clientSecret: process.env.GOOGLE_SECRET
//     // }),
//     // Passwordless / email sign in
//     // EmailProvider({
//     //   server: process.env.EMAIL_SERVER,
//     //   from: "NextAuth.js <support@adsreveal.com>",
//     // }),
//     CredentialsProvider({
//       name: "Credentials",

//       async authorize(credentials, req) {
//         // Add logic here to look up the user from the credentials supplied
//         try {
//           console.log("-------  ---", credentials);

//           const client = await clientPromise;
//           const userCollection = client.db().collection("users");
//           const newUser = {
//             id: 1,
//             email: "john.doe@example.com",
//             password: "password123",
//           };

//           userCollection.insertOne(newUser, (err, user) => {
//             if (err) {
//               console.error("Error inserting user:", err);
//               return null;
//             }

//             console.log("User inserted successfully:", user);
//             return user;
//           });
//         } catch (error) {}

//         // const res = await fetch("http://localhost:8000/auth/login", {
//         //   method: "POST",
//         //   headers: {
//         //     "Content-Type": "application/json",
//         //   },
//         //   body: JSON.stringify({
//         //     username: credentials?.username,
//         //     password: credentials?.password,
//         //   }),
//         // });
//         // const user = await res.json();

//         // if (user) {
//         //   return user;
//         // } else {
//         //   return null;
//         // }
//       },
//     }),
//   ],
//   adapter: MongoDBAdapter(clientPromise, {
//     dbName: "Main",
//     collectionName: "Users",
//   }),
//   // callbacks: {
//   //   async signIn({ user, account, profile, email, credentials }) {
//   //     return true;
//   //   },
//   //   async redirect({ url, baseUrl }) {
//   //     return baseUrl;
//   //   },
//   //   async session({ session, user, token }) {
//   //     return session;
//   //   },
//   //   async jwt({ token, user, account, profile, isNewUser }) {
//   //     return token;
//   //   },
//   // },
// });

// // callbacks: {
// //   async signIn(user, account, profile) {
// //     return true;
// //   },
// //   async session({ session, user, req }) {
// //     if (!user.userData) {
// //       await updateUserPermissions(user.email, "");
// //     }
// //     session.user.userData = user.userData;
// //     console.log("_____", session);
// //     return session;
// //   },
// // },
// // secret: process.env.SECRET,
// // session: {
// //   // Choose how you want to save the user session.
// //   // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
// //   // If you use an `adapter` however, we default it to `"database"` instead.
// //   // You can still force a JWT session by explicitly defining `"jwt"`.
// //   // When using `"database"`, the session cookie will only contain a `sessionToken` value,
// //   // which is used to look up the session in the database.
// //   strategy: "database",

// //   // Seconds - How long until an idle session expires and is no longer valid.
// //   maxAge: 30 * 24 * 60 * 60, // 30 days

// //   // Seconds - Throttle how frequently to write to database to extend a session.
// //   // Use it to limit write operations. Set to 0 to always update the database.
// //   // Note: This option is ignored if using JSON Web Tokens
// //   updateAge: 24 * 60 * 60, // 24 hours

// //   // The session token is usually either a random UUID or string, however if you
// //   // need a more customized session token string, you can define your own generate function.
// //   generateSessionToken: () => {
// //     return randomUUID?.() ?? randomBytes(32).toString("hex");
// //   },
// // },
