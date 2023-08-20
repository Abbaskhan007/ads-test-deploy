import clientPromise from "./lib/mongodb";
import sendResetEmail from "./lib/ResetEmail";
const { v4: uuidv4 } = require("uuid");

function generateResetToken() {
  const uniqueId = uuidv4();
  return uniqueId;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email } = req.body;

      const client = await clientPromise;
      const users = client.db().collection("users");

      const user = await users.findOne({ email });

      if (user) {
        const resetToken = generateResetToken();
        const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour expiry

        await users.updateOne(
          { email },
          {
            $set: {
              resetToken,
              resetTokenExpiry: expiryTime,
            },
          }
        );

        await sendResetEmail(email, resetToken);

        return res.status(200).json({ message: "Email sent" });
      }
    } catch (error) {
      res.status(400).message(error);
    }
  }

  return res.status(404).json({ message: "Not found" });
}
