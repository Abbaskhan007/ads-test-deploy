import { ObjectId } from "mongodb";
import clientPromise from "./lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const advertisements = client.db().collection("Advertisements");

  // const videos = await advertisements
  //   .find()
  //   .sort({ "likes.length": -1 })
  //   .limit(5)
  //   .toArray();

  // const data = await advertisements.aggregate([
  //   // Project with an array length
  //   {
  //     $project: {
  //       ad_name: 1,

  //       likes: 1,
  //       length: { $size: "$likes" },
  //     },
  //   },

  //   // Sort on the "length"
  //   { $sort: { length: -1 } },
  //   { $limit: 5 },

  //   // Project if you really want
  // ]);

  const data = await advertisements
    .aggregate([
      {
        $project: {
          ad_name: 1,
          ad_description: 1,
          website: 1,
          tech: 1,
          date_found: 1,
          video_id: 1,
          likes: 1,
          length: {
            $cond: {
              if: { $isArray: "$likes" },
              then: { $size: "$likes" },
              else: 0,
            },
          },
        },
      },
      { $sort: { length: -1 } },
      { $limit: 9 },
    ])
    .toArray();

  console.log(data);
  res.status(200).json(data);
}

// import { ObjectId } from "mongodb";
// import clientPromise from "./lib/mongodb";

// export default async function handler(req, res) {
//   const client = await clientPromise;
//   const users = client.db().collection("users");
//   const advertisements = client.db().collection("Advertisements");

//   try {
//     // Get all users from the database
//     const allUsers = await users.find().toArray();

//     // Map over all users and create an array of all favorited ad IDs
//     const allFavoritedAds = allUsers.reduce((acc, curr) => {
//       return [...acc, ...curr.userData.favorites];
//     }, []);

//     // Group all favorited ad IDs by their frequency in the array
//     const adFrequencyMap = allFavoritedAds.reduce((acc, curr) => {
//       acc[curr] = (acc[curr] || 0) + 1;
//       return acc;
//     }, {});

//     // Convert ad frequency map to an array of objects with ID and frequency
//     const adFrequencies = Object.entries(adFrequencyMap).map(
//       ([id, frequency]) => ({
//         id,
//         frequency,
//       })
//     );

//     // Sort ad frequency array in descending order by frequency
//     adFrequencies.sort((a, b) => b.frequency - a.frequency);

//     // Get the top 9 most favorited ad IDs
//     const topAdIds = adFrequencies.slice(0, 9).map((ad) => ObjectId(ad.id));

//     // Fetch the ad data for the top 9 most favorited ads
//     const topAds = await advertisements
//       .find({ _id: { $in: topAdIds } })
//       .toArray();

//     res.status(200).json({ success: true, topAds });
//   } catch (error) {
//     console.error("Error getting top ads:", error);
//     res.status(500).json({ success: false, error });
//   }
// }
