import clientPromise from "./lib/mongodb";

// create a logger function that logs the request to the database.
async function logRequest(req) {
  const { q, page, limit, filter, key } = req.query;

  // Connect to MongoDB
  const client = await clientPromise;
  const collection = client.db().collection("Logs");
  const log = {
    request: req.query,
    timestamp: new Date(),
  };

  await collection.insertOne(log);
}

export default async function (req, res) {
  const { q, page, limit, filter, key } = req.query;
  // Connect to MongoDB
  const client = await clientPromise;
  const collection = client.db().collection("Advertisements");

  if (q == "") {
    mostRecentVideos(page);
  }
  mostRecentVideos(collection, page);
}

async function mostRecentVideos(collection, page) {
  const filter = {
    $expr: {
      $gte: [
        {
          $switch: {
            branches: [
              {
                case: {
                  $regexMatch: {
                    input: "$date_found",
                    regex: /^\d{4}-\d{2}-\d{2} \d{2}-\d{2}-\d{2}$/, // format 1
                  },
                },
                then: {
                  $dateFromString: {
                    dateString: "$date_found",
                    format: "%Y-%m-%d %H-%M-%S",
                  },
                },
              },
              {
                case: {
                  $regexMatch: {
                    input: "$date_found",
                    regex: /^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}$/, // format 2
                  },
                },
                then: {
                  $dateFromString: {
                    dateString: "$date_found",
                    format: "%Y-%m-%d_%H-%M-%S",
                  },
                },
              },
            ],
            default: null,
          },
        },
        new Date("2023-02-05T22:17:51Z"),
      ],
    },
  };
  const count = await collection.countDocuments(filter);
  const totalPages = Math.ceil(count / limit);
  const limit = 9;
  const options = {
    limit: limit,
    skip: (page - 1) * limit,
    sort: { date_found: -1 },
  };
  const cursor = collection.find(filter, options);
  const videos = await cursor.toArray();
  console.log(`videos api debug: ${videos[0].date_found}`);
  // Convert _id fields to strings
  const videosWithId = videos.map((video) => {
    return {
      ...video,
      _id: video._id.toHexString(),
    };
  });
  res.status(200).json({ videos: videosWithId, totalPages: totalPages });
}

// anti reverse engineering
// if limit does not equal 9, then save all information about request to logs
// if (limit !== 9) {
//   const logs = client.db().collection("Logs");
//   const log = {
//     request: req.query,
//     timestamp: new Date(),
//   };
// }
//   await logs.insertOne(log);
