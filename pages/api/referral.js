import clientPromise from "./lib/mongodb";
import authMiddleware from "./authMiddleware";

async function updateUserByEmail(email, referralId) {
  const client = await clientPromise;
  const collection = client.db().collection("users");

  console.log("%cReferral ID:", "color: red", referralId);
  console.log("%cEmail:", "color: red", email);
  // TODO: can't check database you removed access
  const result = await collection.updateOne(
    { email: email },
    { $set: { "userData.referredBy": referralId } }
  );

  return result;
}

async function handler(req, res) {
  console.log("data: ", { email: req.body.email, refid: req.body.referralId });
  if (req.method === "POST") {
    const { email, referralId } = req.body;

    if (email && referralId) {
      try {
        console.log(
          `updating ${email} in db to reflect new ref id: ${referralId.ref} `
        );
        const result = await updateUserByEmail(email, referralId.ref);
        res.status(200).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating user." });
      }
    } else {
      res.status(400).json({ message: "Missing email or referral ID." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}

export default authMiddleware(handler);
