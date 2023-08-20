import clientPromise from "./lib/mongodb";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

console.log("stripe key", process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  console.log("Req body---", req.body);
  try {
    const { productId, isTrial, email, price, referralId } = req.body;
    console.log(productId);
    console.log("Price ------------", price);
    const customer = await stripe.customers.create({
      email: req.body.email,
    });

    console.log("====== customer ====", customer);
    if (isTrial) {
      const client = await clientPromise;
      const users = client.db().collection("users");
      const user = await users.findOne({ email });

      if (user?.isTrialClaimed) {
        return res.status(400).json("Trial Already Claimed");
      }

      const invoice = await stripe.invoiceItems.create({
        customer: customer.id,
        price: "price_1Nanb5A67t01HB1A9cxNzIO8",
      });

      const session = await stripe.checkout.sessions.create(
        {
          payment_method_types: ["card"],
          mode: "subscription",
          line_items: [
            {
              price: productId,
              quantity: 1,
            },
          ],
          metadata: {
            custom_identifier: req.body.custom_identifier,
            email: req.body.email,
            productId: productId,
          },
          subscription_data: {
            trial_period_days: 2,
          },
          success_url: `${
            process.env.DOMAIN_NAME
          }/success?email=${email}&price=${price / 100}`,
          cancel_url: `${process.env.DOMAIN_NAME}/payment`,
          customer: customer.id,
          client_reference_id: referralId || undefined,
        },
        { apiKey: process.env.STRIPE_SECRET_KEY }
      );

      const checkoutUrl = session.url;
      console.log(checkoutUrl);
      console.log("1 *************");
      return res.status(200).json({ checkoutUrl });
    }

    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: productId,
            quantity: 1,
          },
        ],
        metadata: {
          custom_identifier: req.body.custom_identifier,
          email: req.body.email,
          productId: productId,
        },
        success_url: `${process.env.DOMAIN_NAME}/success?email=${email}&price=${
          price / 100
        }`,
        cancel_url: `${process.env.DOMAIN_NAME}/payment`,
        customer: customer.id,
        client_reference_id: referralId || undefined,
      },
      { apiKey: process.env.STRIPE_SECRET_KEY }
    );

    console.log(
      "========",
      `${process.env.DOMAIN_NAME}/success?email=${email}&price=${price / 100}`
    );

    const checkoutUrl = session.url;
    console.log(checkoutUrl);
    console.log("2 *************");
    return res.status(200).json({ checkoutUrl });
  } catch (error) {
    console.log("Error in stripe ----", error);
  }
}
