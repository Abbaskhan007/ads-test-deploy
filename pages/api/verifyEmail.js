import clientPromise from "./lib/mongodb";
import { v4 as uuid } from "uuid";
import Head from "next/head";
import crypto from "crypto";
import { VerificationEmail } from "./lib/ResetEmail";

// Usage https://localhost:3000/api/search?q=sephora&page=1

function generateReferralId() {
  console.log("----------=-=-7777");
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("Body sign up", req.body);
      const { token, email } = req.body;
      const client = await clientPromise;
      console.log("------ token ----", token, email);

      const users = client.db().collection("users");
      const user = await users.findOne({ email: email?.toLowerCase() });
      if (user?.email && user.userData.token == token) {
        const updatedUser = await users.findOneAndUpdate(
          { email: email.toLowerCase() },
          {
            $unset: { "userData.token": "", "userData.tokenExpiry": "" }, // Use $unset to remove the 'token' field
            $set: { "userData.active": true }, // Update the 'active' field
          },
          { new: true } // Set 'new' option to true to return the updated document
        );
        return res.status(200).send({ message: "User Account Activated" });
      } else if (user?.userData?.expiryToken < Date.now()) {
        res.status(404).json({ message: "Your Token has Expired" });
      } else {
        return res.status(404).send("User Does not Found");
      }
    } catch (error) {
      console.log("Error", error);
      res.status(400).send(error?.message || error);
    }
  }
}
