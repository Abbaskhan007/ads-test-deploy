import clientPromise from "./lib/mongodb";
import authMiddleware from "./authMiddleware";

// fetches one video based on ObjectId

async function getVideoById(id) {
  const client = await clientPromise;
  const collection = client.db().collection("Advertisements");

  const video = await collection.findOne({ _id: id });

  return video;
}

async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (id) {
      try {
        const video = await getVideoById(id);
        res.status(200).json(video);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving video." });
      }
    } else {
      res.status(400).json({ message: "Missing video id." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}

export default authMiddleware(handler);
