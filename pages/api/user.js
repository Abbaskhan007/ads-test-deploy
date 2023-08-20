import clientPromise from "./lib/mongodb";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  console.log("apiKey:", req.query.apiKey);
  const apiKey = req.query.apiKey;
  const session = await getSession({ req });
  console.log("session:", session);

  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { email } = session.user;
  const client = await clientPromise;
  const users = client.db().collection("users");
  const user = await users.findOne({ email });
  console.log("user:", user);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  if (user.userData.apiKey !== apiKey) {
    res.status(401).json({ message: "Invalid API key" });
    return;
  }

  const credits = user.userData.credits;
  console.log("credits:", credits);
  res.status(200).json({ credits });
}
