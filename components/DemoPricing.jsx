import { BsArrowRight } from "react-icons/bs";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

import { useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Dashboard } from "@mui/icons-material";
const Wrapper = () => {
  const stripePromise = loadStripe(
    "pk_live_51Meo51A67t01HB1AXFC6Ogm7MeT0hh744Y51yzWNHZz6AxnRSfGPRhg3xqUzJuEu2zJLntCqryrqltKt4P83UY2v00ictVZ3w0"
  );
  return (
    <Elements stripe={stripePromise}>
      <DemoPricing />
    </Elements>
  );
};
export default Wrapper;

function DemoPricing() {
  const { data: session } = useSession();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  // console.log("data of user", session);
  const handleClick = async () => {
    if (!stripe || !elements) {
      return;
    }

    // Retrieve referral ID from Rewardful
    const referralId = Rewardful.referral;
    console.log(referralId);

    let body = {};
    if (!session?.user) {
      router.push("/signIn");
    } else if (session?.userData?.subscribed) {
      body = {
        price: "4000",
        productId: "price_1NasmFA67t01HB1Ai27zjaL1",
        isTrial: false,
      };
    } else {
      body = {
        price: "4000",
        productId: "price_1NasmFA67t01HB1Ai27zjaL1",
        isTrial: true,
      };
    }
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "starter",

        email: session.user.email,
        custom_identifier: Math.floor(Math.random() * 900000000) + 100000000,

        referralId: referralId, // Include referral ID in POST data
        ...body,
      }),
    });
    console.log("Response ----", response);
    const stripeUrl = await response.json();
    router.push(stripeUrl.checkoutUrl);
  };
  const getAccessClickHandler = () => {
    if (!session) {
      router.push("/register");
    } else {
      handleClick(
        "starter",
        300,
        //Starter Plan With Trial
        "price_1NTyEMA67t01HB1AfW6IU4XN",
        true
      );
    }
  };
  return (
    <div className="custom-gradient  text-center w-full text-white py-20">
      <h2 className=" lg:text-5xl text-3xl  font-bold mb-6">Pricing</h2>
      <div className="max-w-4xl w-[90%] mx-auto bg-gray-900 px-10 py-20 sm:px-20 rounded-xl border-blue-600 border-2">
        <h2 className="lg:mb-8 mb-4 font-semibold lg:text-2xl text-xl text-gray-200">
          GET TWO DAY TRIAL ACCESS TO ADSREVEAL
        </h2>

        <p className="lg:text-5xl text-2xl font-bold mb-2">Only $0.99</p>
        <p className="text-gray-500 font-medium mb-4">
          **Rebills at $40.00/month** Offer valid until September 1st!
        </p>
        <button
          onClick={getAccessClickHandler}
          className="HomeTrialButton bg-blue-600 w-full mb-3 flex justify-center items-center py-6 rounded-full"
          id="HomeTrialButton"
        >
          <span
            className="HomeTrialButton font-bold text-2xl"
            id="HomeTrialButton"
          >
            Get Access
          </span>
          <BsArrowRight />
        </button>

        <p className="text-gray-500 font-medium">
          Cancel Anytime | Money Back Guarantee | No Questions Asked
        </p>
        <div className="flex justify-center items-center gap-6 lg:mt-8 mt-4 sm:mt-6">
          <p className="text-gray-600">
            Pay <br /> With
          </p>
          <div className="w-[50px] h-[50px">
            <Image
              className="w-full"
              alt="master card image"
              width={100}
              height={100}
              src={"/images/master-card.png"}
            />
          </div>
          <div className="w-[50px] h-[50px]">
            <Image
              className="w-full"
              alt="master card image"
              width={100}
              height={100}
              src={"/images/visa.png"}
            />
          </div>
          <div className="w-[50px] h-[50px]">
            <Image
              className="w-full"
              alt="american express "
              width={100}
              height={100}
              src={"/images/express.png"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
