import clientPromise from "./lib/mongodb";

export default async function handler(req, res) {
  try {
    console.log("-----------");
    const { email } = req.query;
    const client = await clientPromise;
    const users = client.db().collection("users");
    const user = await users.findOne({ email });
    console.log("user", user);
    if (!user) {
      return res.status(404).json("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error", error);
    res.status(400).json(error);
  }
}
