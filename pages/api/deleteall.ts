import clientPromise from "./lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;

    const collection = client.db().collection("Advertisements");
    const result = await collection.deleteMany({});

    console.log(`Deleted ${result.deletedCount} documents from the "Advertisements" collection`);
    return res.status(200).json({ message: `Deleted ${result.deletedCount} documents from the "Advertisements" collection` });
  } catch (error: any) {
    console.error(`Error in handler: ${error.message}`);
    return res.status(500).json({ error: "Server error" });
  }
}