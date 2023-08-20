import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../lib/mongodb";
import { ObjectId } from "mongodb";

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Web hook 2 *******************");
  if (req.method === "POST" && req.body.type === "payment_intent.succeeded") {
    const { id, type, data, livemode, created, request, api_version } =
      req.body;

    console.log("Webhook received with the following data:");
    console.log(`- Type: ${type}`);
    console.log(`- Livemode: ${livemode}`);
    console.log(`- metadata: ${data.object.metadata.custom_identifier}`);
    console.log(
      `- data object test: ${JSON.stringify(data.object.metadata, null, 2)}`
    );
    // Extract necessary data from Stripe webhook payload
    const customerId = data.object.customer;
    const paymentAmount = data.object.amount;
    const paymentMethod = data.object.payment_method;
    const plan = data.object.metadata.plan;

    try {
      // Retrieve user's profile from MongoDB
      console.log("Retrieving User Profile");
      const client = await clientPromise;
      const collection = client.db().collection("users");
      const user = await collection.findOne({ customerId });

      if (!user) {
        console.log(`User with ID ${customerId} not found in MongoDB`);
        return res.status(404).end();
      }

      // Verify that the user object retrieved from MongoDB is a valid ObjectId
      if (!ObjectId.isValid(user._id)) {
        console.log(`Invalid ObjectId ${user._id} retrieved from MongoDB`);
        return res.status(500).json({ message: "Invalid user ID" });
      }
      console.log({ amount: paymentAmount, method: paymentMethod });
      // Update user's profile with new payment information
      user.userData.stripeData.push({
        amount: paymentAmount,
        method: paymentMethod,
      });

      // Add credits to the user's account based on the plan

      console.log("*****************************");
      if (plan === "starter") {
        user.userData.credits += 100;
      } else if (plan === "pro") {
        user.userData.credits += 250;
      } else if (plan === "premium") {
        user.userData.credits += 500;
      }

      await collection.updateOne({ _id: user._id }, { $set: user });

      console.log(
        `User with ID ${customerId} updated in MongoDB with payment:`,
        { amount: paymentAmount, method: paymentMethod }
      );
      res.status(200).json({ received: true });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error updating user profile in MongoDB." });
    }
  } else if (req.body.type === "customer.subscription.trial_will_end") {
    console.log("Payment stripe two ---------------.........--------");
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default webhookHandler;
