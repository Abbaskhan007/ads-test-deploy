"use client";
import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const createSubscription = async () => {
    try {
      const card = elements.getElement(CardElement);

      console.log("---------", stripe, elements);
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: plan,
          price: price,
          email: session.user.email,
          custom_identifier: Math.floor(Math.random() * 900000000) + 100000000,
          productId: productId,
          // stripeToken: token.id,
          // referralId: referralId, // Include referral ID in POST data
        }),
      });

      const { token, error } = await stripe?.createToken(card);
      console.log("-------", token, error);
    } catch (error) {
      console.log("****** error ****", error);
    }
  };

  return (
    <div>
      <CardElement />
      <button onClick={createSubscription}>Create subscription</button>
    </div>
  );
}
