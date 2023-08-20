import clientPromise from "./lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;

    // Create a large JSON array
    const advertisements = [];
    for (let i = 0; i < 100000; i++) {
      advertisements.push({
        title: `Advertisement ${i}`,
        content: `This is the content of advertisement ${i}`,
      });
    }

    // Insert the JSON array into the "Advertisements" collection
    const result = await client
      .db()
      .collection("Advertisements")
      .insertMany(advertisements);
    console.log(
      `Inserted ${result.insertedCount} documents into the "Advertisements" collection`
    );

    // Delete the JSON array from the "Advertisements" collection
    const deleteResult = await client
      .db()
      .collection("Advertisements")
      .deleteMany({});
    console.log(
      `Deleted ${deleteResult.deletedCount} documents from the "Advertisements" collection`
    );

    return res
      .status(200)
      .json({
        message: `Inserted ${result.insertedCount} documents into the "Advertisements" collection and deleted ${deleteResult.deletedCount} documents`,
      });
  } catch (error: any) {
    console.error(`Error in handler: ${error.message}`);
    return res.status(500).json({ error: "Server error" });
  }
}
