import { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import Navigation from "../components/Navigation";
import { AiFillCheckCircle } from "react-icons/ai";
import StripePricingTable from "../components/StripePricingTable";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import axios from "axios";

<Head>
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`,
    }}
  />
  <script async src="https://r.wdfl.co/rw.js" data-rewardful="6e34fc"></script>
</Head>;

const Wrapper = () => {
  const stripePromise = loadStripe(
    "pk_live_51Meo51A67t01HB1AXFC6Ogm7MeT0hh744Y51yzWNHZz6AxnRSfGPRhg3xqUzJuEu2zJLntCqryrqltKt4P83UY2v00ictVZ3w0"
  );
  return (
    <Elements stripe={stripePromise}>
      <Payment />
    </Elements>
  );
};

// export default Payment;
export default Wrapper;

const PricingCard = ({ title, description, price }) => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleClick = async () => {
    alert("-----");
    setLoading(true);
    const stripe = await stripePromise;

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "test-package",
        price: 9000,
        email: session.user.email,
        custom_identifier: Math.floor(Math.random() * 900000000) + 100000000,
      }),
    });
    const stripeUrl = await response.json();
    Router.push(stripeUrl.checkoutUrl);
    //await stripe.redirectToCheckout({ sessionId: session.id });
    setLoading(false);
  };

  // TODO: when someone clicks on "subscribe" script will make an api request to generate a custom url

  return (
    <div className="flex flex-col items-center p-6 border rounded-md shadow-md">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-4 mb-8 text-gray-500">{description}</p>
      <h3 className="text-3xl font-bold">{price}$</h3>
      <button
        // onClick={handleClick}
        disabled={!session || loading}
        className="mt-8 px-6 py-3 text-lg font-bold text-white uppercase rounded-md bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Buy Now"}
      </button>
    </div>
  );
};

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [stripeData, setStripeData] = useState({});
  // const session = getSession(context);
  const { data: session } = useSession();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const handleClick = async (plan, price, productId, isTrial = false) => {
    if (!session?.email) {
      return router.push("/signIn");
    }

    setLoading(true);
    if (!stripe || !elements) {
      return;
    }

     // Retrieve referral ID from Rewardful
     let referralId;
     if (window.Rewardful?.referral) {
       referralId = window.Rewardful.referral
       console.log(referralId);
     } else {
       referralId = undefined;
     }

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
        isTrial,
        referralId: referralId, // Include referral ID in POST data
      }),
    });
    const stripeUrl = await response.json();
    router.push(stripeUrl.checkoutUrl);
    setLoading(false);
  };
  console.log("user", session);
  const getUser = async () => {
    const { data } = await axios.get(`/api/getUser?email=${session?.email}`);
    setStripeData(data);
    console.log("Data ------", data);
    //console.log("*** subscription", data.userData.stripeData[9].subscription);
  };
  useEffect(() => {
    if (session?.email) {
      getUser();
    }
  }, [session]);

  useEffect(() => {
    // Wait for Rewardful to be loaded
    if (window.Rewardful) {
      setLoading(false);
    } else {
      window.addEventListener("rewardful:loaded", () => {
        setLoading(false);
      });
    }
  }, []);
  console.log("****** Stripe data", stripeData);

  return (
    <>
      <Navigation />
      <br />
      <br />
      <div class="md:flex justify-center lg:gap-16 sm:gap-10 w-[90%] max-w-5xl mx-auto">
        <div class="rounded-lg md:w-full border border-blue-600 sm:pt-14 pt-4 md:mb-0 mb-10 mx-auto max-w-[90%] sm:max-w-[70%] bg-white shadow-md">
          <div class="text-center sm:w-[60%] w-[90%] mx-auto">
            {(stripeData?.userData?.subscriptionType === "Trial" ||
              stripeData?.userData?.subscriptionType === "Starter") && (
              <div className="flex justify-center -mt-6">
                <AiFillCheckCircle size={28} color="blue" />
              </div>
            )}
            <h3 className="mb-2 text-lg md:text-2xl font-medium  text-gray-900">
              Starter
            </h3>
            <div className="mb-4 text-4xl md:text-6xl  font-semibold text-blue-500">
              $40
            </div>
            <div className="mb-4 text-gray-600 text-lg">Per month</div>
            <div>
              <div>
                <button
                  onClick={() =>
                    handleClick(
                      "starter",
                      4000,
                      //Starter Plan With Trial
                      "price_1NasmFA67t01HB1Ai27zjaL1",
                      true
                    )
                  }
                  disabled={stripeData?.userData?.isTrialClaimed}
                  class="mb-2 rounded-md w-full disabled:bg-gray-300 disabled:text-gray-400 bg-blue-500  px-4 py-3 text-white transition-colors duration-150 hover:bg-blue-600"
                  id="startTrialButton"

                >
                  {/* ///// */}
                  {stripeData?.userData?.isTrialClaimed
                    ? "Trial Claimed"
                    : " Start 3-day trial for $1"}
                </button>
              </div>
              <div>
                <button
                  onClick={() =>
                    //Starter Plan Without Trial
                    handleClick(
                      "starter",
                      4000,
                      "price_1NasmFA67t01HB1Ai27zjaL1"
                    )
                  }
                  className="underline underline-offset-2 mb-4 text-blue-500 font-medium"
                  id="StarterPlanNoTrial"

                >
                  subscribe without trial
                </button>
              </div>
            </div>
            <ul class="mb-14 space-y-2 text-gray-700 ">
              <li class="flex items-center justify-center">
                <i class="material-icons mr-2 align-middle text-blue-500">
                  &#10003;
                </i>
                <span class="font-medium">7,500 Ad Views per Month</span>
              </li>
              <li class="flex items-center justify-center">
                <i class="material-icons mr-2 align-middle text-blue-500">
                  &#10003;
                </i>
                <span class="font-medium">View Top Ads</span>
              </li>
              <li class="flex items-center justify-center">
                <i class="material-icons mr-2 align-middle text-blue-500">
                  &#10003;
                </i>
                <span class="font-medium">Save Favorited Ads</span>
              </li>
            </ul>
          </div>
          <div class="w-full mt-auto rounded-b-lg bg-blue-500 py-2 text-center text-white">
            <span class="text-lg font-medium">Most popular</span>
          </div>
        </div>

        <div class="rounded-lg md:w-full border border-blue-600 sm:pt-14 pt-4 md:mb-0 mb-10 mx-auto max-w-[90%] sm:max-w-[70%] bg-white shadow-md">
          <div class="text-center sm:w-[60%] w-[90%] mx-auto">
            {stripeData?.userData?.subscriptionType === "Pro" && (
              <div className="flex justify-center -mt-6">
                <AiFillCheckCircle size={28} color="blue" />
              </div>
            )}
            <h3 class="mb-2 text-lg md:text-2xl font-medium  text-gray-900">Pro</h3>
            <div class="mb-4 text-4xl md:text-6xl font-semibold text-blue-500">$75</div>
            <div class="mb-4 text-gray-600 text-lg">Per month</div>
            <button
              onClick={() =>
                handleClick("pro", 7500, "price_1Nbu4uA67t01HB1AlA3cnMi1")
              }
              class="mb-4 w-full rounded-md bg-blue-500  px-4 py-3 text-white transition-colors duration-150 hover:bg-blue-600"
              id="subscribe-button"
            >
              Subscribe
            </button>
            <ul class="mb-14 space-y-2 text-gray-700">
              <li class="flex items-center justify-center">
                <i class="material-icons mr-2 align-middle text-blue-500">
                  &#10003;
                </i>
                <span class="font-medium">15,000 Ad Views per Month</span>
              </li>
              <li class="flex items-center justify-center">
                <i class="material-icons mr-2 align-middle text-blue-500">✓</i>
                <span class="font-medium">View Top Ads</span>
              </li>
              <li class="flex items-center justify-center">
                <i class="material-icons mr-2 align-middle text-blue-500">✓</i>
                <span class="font-medium whitespace-nowrap">
                  Save and Track Favorite Ads
                </span>
              </li>
              <li class="flex items-center justify-center">
                <i class="material-icons mr-2 align-middle text-blue-500">✓</i>
                <span class="font-medium">Priority Support</span>
              </li>
            </ul>
          </div>
          <div class="w-full mt-auto rounded-b-lg bg-blue-500 py-2 text-center text-white">
            <span class="text-lg  font-medium">Best value</span>
          </div>
        </div>
        {/* <div class="flex w-full max-w-sm flex-col items-center rounded-lg bg-white shadow-md mx-4">
          <div class="px-6 py-8 text-center">
            {stripeData?.userData?.subscriptionType === "Premium" && (
              <div className="flex justify-center -mt-6">
                <AiFillCheckCircle size={28} color="blue" />
              </div>
            )}
            <h3 class="mb-2 text-lg font-medium text-gray-900">Premium</h3>
            <div class="mb-4 text-4xl font-semibold text-blue-500">$199</div>
            <div class="mb-4 text-gray-600">per month</div>
            <button
              onClick={() =>
                handleClick("premium", 19900, "price_1MpdptA67t01HB1AllGCI8a4")
              }
              class="mb-4  rounded-md bg-blue-500 w-[250px] px-4 py-3 text-white transition-colors duration-150 hover:bg-blue-600"
              id="subscribe-button"
            >
              Subscribe
            </button>
            <ul class="mb-8 space-y-2 text-gray-700">
              <li class="flex items-center">
                <i class="material-icons mr-2 align-middle text-blue-500">
                  &#10003;
                </i>
                <span class="font-medium">Unlimited People per Account</span>
              </li>
              <li class="flex items-center">
                <i class="material-icons mr-2 align-middle text-blue-500">
                  &#10003;
                </i>
                <span class="font-medium">Unlimited Ad Views per Day</span>
              </li>
              <li class="flex items-center">
                <i class="material-icons mr-2 align-middle text-blue-500">
                  &#10003;
                </i>
                <span class="font-medium">
                  Advanced Ad Tracking and Analytics
                </span>
              </li>
              <li class="flex items-center">
                <i class="material-icons mr-2 align-middle text-blue-500">
                  &#10003;
                </i>
                <span class="font-medium">Customizable Dashboard</span>
              </li>
              <li class="flex items-center">
                <i class="material-icons mr-2 align-middle text-blue-500">
                  &#10003;
                </i>
                <span class="font-medium">Dedicated Account Manager</span>
              </li>
            </ul>
          </div>
          <div class="w-full rounded-b-lg mt-auto bg-blue-500 py-2 text-center text-white">
            <span class="text-sm font-medium">For businesses</span>
          </div>
        </div> */}
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }
  console.log("session", session);
  console.log("session ", session);
  return {
    props: {
      user: session,
    },
  };
}
