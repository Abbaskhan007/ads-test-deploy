// Cancel Stripe Subscription

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { subscriptionId } = req.body;
  const subscription = await stripe.subscriptions.del(subscriptionId);
  res.status(200).json({ subscription });
  try {
  } catch (error) {
    console.log("ERrror", error);
    res.status(400).json(error);
  }
}
