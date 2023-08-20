import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../lib/mongodb";
import { ObjectId } from "mongodb";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Web hool running ************************s body", req.body);
  if (req.method === "POST") {
    const { id, type, data, livemode, created, request, api_version } =
      req.body;

    console.log("Webhook received with the following data:");
    console.log(`- Type: ${type}`);
    console.log(`- Livemode: ${livemode}`);
    console.log(`- metadata: ${data.object.metadata.custom_identifier}`);
    console.log(`- data object test: ${JSON.stringify(data.object, null, 2)}`);

    // Extract necessary data from Stripe webhook payload
    let customerId, paymentAmount, paymentMethod;

    if (type === "checkout.session.completed") {
      customerId = data.object.customer_details.email;
      paymentAmount = data.object.amount_total;
      paymentMethod = data.object.payment_method;
    } else if (type === "invoice.payment_succeeded") {
      customerId = data.object.customer_email;
      paymentAmount = data.object.amount_paid;
      paymentMethod = data.object.payment_intent.payment_method;
    } else if (type === "customer.subscription.deleted") {
      try {
        const client = await clientPromise;
        const collection = client.db().collection("users");
        customerId = data.object.customer;
        
        if(data?.object?.plan?.id === "price_1NSIevA67t01HB1AxV7pRJZi"){
        
        const user = await collection.findOneAndUpdate(
          {
            "userData.stripeData.customer": customerId,
          },
          {
            $set: {
              "userData.credits": 0,
              "userData.stripeData": {},
              "userData.subscribed": false,
              "userData.subscriptionType": "free",
            },
          }
        );
        }else{
          const user = await collection.findOneAndUpdate(
            {
              "userData.stripeData.customer": customerId,
            },
            {
              $set: {
                "userData.stripeData": {},
                "userData.subscribed": false,
                "userData.subscriptionType": "free",
              },
            })
        }
        console.log("Subscription has cancelled **************** *******");
        return res
          .status(200)
          .json({message:"The Stripe data is successfully unsubscribed",data});
      } catch (error) {
        console.log("Error -----", error);
        return res.status(400).json(error);
      }
    }
    try {
      // Retrieve user's profile from MongoDB
      console.log("Retrieving User Profile");
      const client = await clientPromise;
      const collection = client.db().collection("users");
      const user = await collection.findOne({
        email: customerId.toLowerCase(),
      });

      console.log("User----", user);

      if (!user) {
        console.log(
          `User with email ${data.object.metadata.email} not found in MongoDB`
        );
        return res.status(404).end();
      }

      // Verify that the user object retrieved from MongoDB is a valid ObjectId
      if (!ObjectId.isValid(user._id)) {
        console.log(`Invalid ObjectId ${user._id} retrieved from MongoDB`);
        return res.status(500).json({ message: "Invalid user ID" });
      }
      console.log({ amount: paymentAmount, method: paymentMethod });
      // Update user's profile with new payment information
      //user.userData.stripeData = data.object;

      // Add credits to the user's account based on the plan
      // 5500 = $55
      user.userData.subscribed = true;
      if (paymentAmount === 4000) {
        user.userData.subscriptionType = "Starter";
        user.userData.credits = 7500;
      } else if (paymentAmount === 7500) {
        // 10000 = $100
        user.userData.subscriptionType = "Pro";
        user.userData.credits = 15000;
      } else if (paymentAmount === 19900) {
        user.userData.subscriptionType = "Premium";
        // $150 = 15000
        user.userData.credits = 10000;
      } else if (paymentAmount === 100) {
        user.userData.subscriptionType = "Trial";
        user.userData.credits = 500;
        user.userData.isTrialClaimed = true;
      }

      await collection.updateOne({ _id: user._id }, { $set: user });

      console.log(
        `User with Email ${data.object.metadata.email} updated in MongoDB with payment:`,
        { amount: paymentAmount, method: paymentMethod }
      );
      res.status(200).json({ received: true });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error updating user profile in MongoDB." });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default webhookHandler;
