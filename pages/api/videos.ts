import clientPromise from "./lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;

    const collection = client.db().collection("Advertisements");
    const page = parseInt(req.query.page) || 1;
    const limit = 9;

    const apiKey: string = req.query.key;
    const searchQuery = req.query.query || "";
    const filterValue = req.query.filter || "";
    const { startDate, endDate } = req.query;

    const searchFilter = searchQuery
      ? {
          $or: [
            { ad_description: { $regex: searchQuery, $options: "i" } },
            { ad_name: { $regex: searchQuery, $options: "i" } },
            { website: { $regex: searchQuery, $options: "i" } },
          ],
        }
      : {};

    const techFilter =
      filterValue && filterValue !== "all"
        ? { tech: { $regex: filterValue, $options: "i" } }
        : {};

    const filter = {
      $and: [searchFilter, techFilter],
      date_found: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    const count = await collection.countDocuments(filter);
    const totalPages = Math.ceil(count / limit);

    const options = {
      limit: limit,
      skip: (page - 1) * limit,
      //sort: { date_found: -1 },
    };

    const cursor = collection.find(filter, options).sort({ date_found: -1,_id: -1 });
    const videos = await cursor.toArray();

    const user = await creditSub(apiKey, videos.length);
    const remainingCredits = user?.userData.credits;

    if (remainingCredits < limit) {
      console.error(`User with API key ${apiKey} has insufficient credits`);
      return res.status(401).json({
        error: "Insufficient credits",
        videos: [],
        totalPages: 0,
      });
    }

    if (videos.length === 0) {
      console.log("No videos found");
      return res.status(200).json({ videos: [], totalPages: 0 });
    }

    const videosWithId = videos.map(video => ({
      ...video,
      _id: video._id.toHexString(),
    }));

    //console.log("videosWithId:  ", videosWithId);
    //console.log("totalPages: ", totalPages);
    return res.status(200).json({ videos: videosWithId, totalPages });
  } catch (error: any) {
    console.error(`Error in handler: ${error.message}`);
    return res.status(500).json({ error: "Server error" });
  }
}

async function creditSub(apiKey: string, numVideos: number) {
  // console.log("Begin api/videos/creditSub() debug");
  const subClient = await clientPromise;
  const users = subClient.db().collection("users");
  const user = await users.findOne({ "userData.apiKey": apiKey });

  console.log("----------- user -----------", user);

  if (!user) {
    console.error(`User with API key ${apiKey} not found`);
    return null;
  }
  //console.log("USER CREDITS BEFORE UPDATING: ", user.userData.credits);
  const remainingCredits = user.userData.credits;
  console.log("number of videos: ", numVideos);
  if (remainingCredits < numVideos) {
    console.error(`User with API key ${apiKey} has insufficient ad views remaining`);
    return null;
  }

  // console.log("REMAINING CREDITS and numVideos : ", {
  //   remainingCredits,
  //   numVideos,
  // });
  await users.updateOne(
    { _id: user._id },
    { $set: { "userData.credits": remainingCredits - numVideos } }
  );

  //console.log("USER CREDIT DATA AFTER UPDATING: ", user.userData.credits);

  return user;
}
