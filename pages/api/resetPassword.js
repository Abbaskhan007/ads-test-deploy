import clientPromise from "./lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("Req.body -------", req.body);
    const { password, token } = req.body;

    const client = await clientPromise;
    const users = client.db().collection("users");

    const user = await users.findOne({
      resetToken: token,
      // Check if token is not expired
    });
    console.log("User ---", user);

    if (user) {
      await users.updateOne(
        { resetToken: token },
        {
          $set: {
            password,
            resetToken: null,
            resetTokenExpiry: null,
          },
        }
      );

      return res.status(200).json({ message: "Password reset successfully" });
    }
  }

  return res.status(404).json({ message: "Not found" });
}
