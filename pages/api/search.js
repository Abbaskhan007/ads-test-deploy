import clientPromise from "./lib/mongodb";

// Usage https://localhost:3000/api/search?q=sephora&page=1

export default async function handler(req, res) {
  const { q } = req.query;

  // Connect to MongoDB
  const client = await clientPromise;
  const collection = client.db().collection("Advertisements");
  await collection.createIndex({ ad_description: "text" });

  const filter = q ? { $text: { $search: q } } : {};
  const count = await collection.countDocuments(filter);
  const totalPages = Math.ceil(count / 10); // assuming you want 10 results per page
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * 10;
  const options = {
    limit: 9,
    skip: skip,
    sort: { date_found: -1 },
  };
  const videos = await collection.find(filter, options).toArray();

  res.status(200).json({ videos, totalPages });
}

// export default async function handler(req, res) {
//   const { id } = req.query;
//   const client = await clientPromise;
//   const collection = client.db().collection("Advertisements");
//   const video = await collection.findOne({ _id: ObjectId(id) });
//   res.status(200).json({ video });
// }
