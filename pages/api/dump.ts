import clientPromise from "./lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;

    const collection = client.db().collection("Advertisements");
    const cursor = collection.find({});
    const advertisements = await cursor.toArray();

    const json = JSON.stringify(advertisements, null, 2);
    fs.writeFile("advertisements2.json", json, "utf8", (err) => {
      if (err) {
        console.error(`Error writing to file: ${err}`);
        return res.status(500).json({ error: "Server error" });
      }
      console.log("File created successfully");
      return res.status(200).json({ message: "File created successfully" });
    });
  } catch (error: any) {
    console.error(`Error in handler: ${error.message}`);
    return res.status(500).json({ error: "Server error" });
  }
} 
