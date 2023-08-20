import clientPromise from "./mongodb";

async function getVideos(limit, skip) {
  try {
    const client = await clientPromise;
    const collection = client
      .db("your_database_name")
      .collection("your_collection_name");

    const documents = await collection.find().skip(skip).limit(limit).toArray();

    return documents.map((doc) => ({ ...doc, _id: doc._id.toString() }));
  } catch (error) {
    console.error(
      "Error connecting to the database or fetching documents",
      error
    );
  }
}

// Usage example:
// getVideos(5, 10)
//   .then((documents) => console.log(documents))
//   .catch((error) => console.error("Error fetching documents", error));

export { getVideos };
