import clientPromise from "./lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { method } = req;
  const { videoId, isFavorited, apiKey } = req.query;

  switch (method) {
    case "DELETE":
      try {
        const client = await clientPromise;
        const users = client.db().collection("users");
        const videos = client.db().collection("Advertisements");

        // Find user by apiKey
        const user = await users.findOne({ "userData.apiKey": apiKey });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Remove video from user's favorites array
        const favorites = user.favorites.filter(
          favorite => favorite !== videoId
        );
        await users.updateOne(
          { _id: user._id },
          { $set: { favorites: favorites } }
        );

        console.log("/////////", videoId, ObjectId(user._id));

        // const updatedVideo = await videos.findOneAndUpdate(
        //   { _id: videoId },
        //   { $pull: { likes: ObjectId(user._id) } }
        // );
        const updatedVideo = await videos.findOneAndUpdate(
          { _id: ObjectId(videoId) },
          { $pull: { likes: user._id.toString() } }
        );

        console.log("Updated Video", updatedVideo);

        return res
          .status(200)
          .json({ message: "Video removed from favorites" });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
      break;
    case "GET":
      try {
        const client = await clientPromise;
        const users = client.db().collection("users");
        const videos = client.db().collection("Advertisements");

        // Check if the user with the provided API key exists
        const user = await users.findOne({
          "userData.apiKey": apiKey,
        });
        if (!user) {
          throw new Error("User not found");
        }

        // Fetch the user's favorite videos from the Advertisements collection
        const favoriteVideos = await videos
          .find({
            _id: { $in: user.favorites.map(id => ObjectId(id)) },
          })
          .toArray();

        // Return an array of objects containing the video ID and video data
        const favoriteVideoData = favoriteVideos.map(video => ({
          id: video._id.toString(),
          data: video,
        }));

        res.status(200).json({ success: true, favorites: favoriteVideoData });
      } catch (error) {
        console.error("Error getting favorite status:", error);
        res.status(500).json({ success: false, error });
      }
      break;
    case "POST":
      console.log("req body: ", req.body);

      try {
        const client = await clientPromise;
        const users = client.db().collection("users");

        // Check if the user with the provided API key exists
        const user = await users.findOne({
          "userData.apiKey": req.body.apiKey,
        });
        if (!user) {
          throw new Error("User not found");
        }
        console.log("user like", user);

        // Update the user's favorites
        await users.updateOne(
          { _id: ObjectId(user._id) },
          req.body.isFavorited
            ? {
                $push: {
                  favorites: req.body.videoId,
                },
              }
            : {
                $pull: {
                  favorites: req.body.videoId,
                },
              },
          { returnOriginal: false }
        );
        const favouritesCollection = client.db().collection("Advertisements");

        await favouritesCollection.updateOne(
          {
            _id: ObjectId(req.body.videoId),
          },
          req.body.isFavorited
            ? {
                $push: {
                  likes: req.body.userId,
                },
              }
            : {
                $pull: {
                  likes: req.body.userId,
                },
              }
        );
        const updatedVideo = await favouritesCollection.findOne({
          _id: ObjectId(req.body.videoId),
        });
        console.log("-=-=-=-=-=", updatedVideo);
        res.status(200).json({ success: true, updatedVideo });
      } catch (error) {
        console.error("Error updating favorite status:", error);
        res.status(500).json({ success: false, error });
      }
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
