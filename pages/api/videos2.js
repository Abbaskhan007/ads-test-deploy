import clientPromise from "./lib/mongodb";
import authMiddleware from "./authMiddleware";
import moment from "moment";

async function getFavoriteVideosByIds() {
  try {
    const client = await clientPromise;
    const collection = client.db().collection("Advertisements");

    const result = await collection.find({ _id: { $in: ids } }).toArray();

    // Convert date_found strings to Date objects
    const parsedResults = result.map((r) => ({
      ...r,
      date_found: r.date_found
        ? moment(r.date_found, "YYYY-MM-DD HH-mm-ss").toDate()
        : null,
    }));

    return parsedResults;
  } catch (error) {
    console.error(error);
    throw new Error("Error retrieving favorite videos.");
  }
}

async function handler(req, res) {
  // check to make sure get request is being made and type is 'favorites'
  if (req.method === "GET" && req.query.type === "favorites") {
    const { ids } = req.body;

    try {
      const favoriteVideos = await getFavoriteVideosByIds(ids);
      res.status(200).json(favoriteVideos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving favorite videos." });
    }
  }
  if (req.method === "GET" && req.query.type === "default") {
    try {
      const client = await clientPromise;
      const collection = client.db().collection("Advertisements");

      const result = await collection
        .find({})
        .sort({ $natural: -1 })
        .limit(9)
        .toArray();

      // Filter out videos with null date_found values
      const filteredResults = result.filter((r) => r.date_found);

      // Sort by date_found in descending order
      const sortedResults = filteredResults.sort(
        (a, b) => new Date(b.date_found) - new Date(a.date_found)
      );

      // Return the first 9 results
      const limitedResults = sortedResults.slice(0, 9);

      res.status(200).json(limitedResults);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving videos." });
    }
  }
}

export default authMiddleware(handler);
