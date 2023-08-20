import clientPromise from "./lib/mongodb";
import { v4 as uuid } from "uuid";
import Head from "next/head";
import crypto from "crypto";
import { VerificationEmail } from "./lib/ResetEmail";

<Head>
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`,
    }}
  />
  <script async src="https://r.wdfl.co/rw.js" data-rewardful="6e34fc"></script>
</Head>;
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
      const { firstName, lastName, email, password, providerType } = req.body;
      const client = await clientPromise;

      const users = client.db().collection("users");
      const user = await users.findOne({ email: email.toLowerCase() });
      console.log("User", user);
      if (user && user?.userData?.active) {
        console.log("*******");
        return res.status(400).send("User with Email Already exist");
      } else if (user && !user?.userData?.active) {
        console.log("------ ****");
        const uniqueToken = crypto.randomBytes(20).toString("hex");
        const updatedUser = await users.findOneAndUpdate(
          { email: email.toLowerCase() },
          {
            $set: {
              password,
              "userData.token": uniqueToken,
              "userData.tokenExpiry": Math.floor(Date.now() / 1000) + 1800,
            },
          },
          { new: true }
        );
        VerificationEmail(email.toLowerCase(), uniqueToken);
        res
          .status(200)
          .json({ message: "Verification Link is send to your Account" });
      } else {
        const newApiKey = uuid();
        const userReferralId = generateReferralId();
        const uniqueToken = crypto.randomBytes(20).toString("hex");
        const newUser = {
          firstName,
          lastName,
          email: email.toLowerCase(),
          password,
          providerType,
          userData: {
            // stripeData: [],
            // referredBy: referralId ? referralId : "none",
            userReferralId,
            credits: 25,
            apiKey: newApiKey,
            favorites: [],
            subscribed: false,
            subscriptionType: "",
            isTrialClaimed: false,
            active: false,
            token: uniqueToken,
            tokenExpiry: Math.floor(Date.now() / 1000) + 1800,
          },
        };
        users.insertOne(newUser, (err, data) => {
          if (err) {
            console.error("Error inserting user:", err);
            return res.status(400).send(err?.message || err);
          }
          console.log("********", uniqueToken);
          VerificationEmail(email.toLowerCase(), uniqueToken);
          console.log("User inserted successfully:", data);
          res
            .status(200)
            .json({ message: "Verification Link is send to your Account" });
          // res.status(200).json({ message: "user created successfully", data });
        });
      }
    } catch (error) {
      console.log("Error", error);
      res.status(400).send(error?.message || error);
    }
  }
}
