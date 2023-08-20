const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const unixTimestamp = Math.floor(tomorrow.getTime() / 1000);
  console.log("--------------", req.body);
  const { productId, referralId } = req.body; // Retrieve referral ID from POST data
  const session = await stripe.subscriptions.create({
    
    mode: "subscription",
    customer: "cus_OCb0nTZnJ0CWE1",
    trial_end: unixTimestamp,
    items: [
      {
        price: "price_1NQG7tA67t01HB1ANU4oSDV9",
      },
    ],
    metadata: {
      custom_identifier: req.body.custom_identifier,
      email: req.body.email,
      //Put real product Id here
      productId: "price_1NQG7tA67t01HB1ANU4oSDV9",
    },

    // payment_method_types: ["card"],
    // mode: "subscription",
    // line_items: [
    //   {
    //     //Put real product Id here
    //     price: "price_1N4C5PA67t01HB1AEgiPVv1w",
    //     quantity: 1,
    //   },
    // ],
    // metadata: {
    //   custom_identifier: req.body.custom_identifier,
    //   email: req.body.email,
    //   //Put real product Id here
    //   productId: "price_1N4C5PA67t01HB1AEgiPVv1w",
    // },
    // success_url: `http://localhost:3000/success`,
    // cancel_url: "http://localhost:3000/payment",
    // success_url: `http://app.adsreveal.com/success`,
    // cancel_url: "http://app.adsreveal.com/payment",
    // Pass referral ID as client_reference_id
    // client_reference_id: referralId, // Include referral ID in Stripe API call
  });
  const checkoutUrl = session.url;
  console.log(checkoutUrl);

  res.status(200).json({ checkoutUrl });
}
