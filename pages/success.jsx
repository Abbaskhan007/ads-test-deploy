import { useRouter } from "next/router";
import Head from "next/head";
import paymentAnimation from "../public/payement-animation.json";
import { useLottie } from "lottie-react";
import { useEffect, useState } from "react";

<Head>
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`,
    }}
  />
  <script async src="https://r.wdfl.co/rw.js" data-rewardful="6e34fc"></script>
</Head>;
const Success = () => {
  const router = useRouter();
  const [credits, setCredits] = useState(0);

  const options = {
    animationData: paymentAnimation,
    loop: true,
  };

  const { View } = useLottie(options);

  const { price } = router.query;

  useEffect(() => {
    console.log("price", price);
    switch (parseInt(price, 10)) {
      case 1:
        setCredits(1000);
        break;
      case 55:
        setCredits(1000);
        break;
      case 99:
        setCredits(15000);
        break;
      case 199:
        setCredits(10000);
        break;
    }
  }, [price]);

  return (
    <div className="flex flex-col  items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[800px] flex flex-col items-center">
        <div className="w-[450px]  h-[450px] p-0 m-0 -mt-32">{View}</div>
        <h1 className="mb-3 text-3xl font-bold text-green-600">
          Payment Successful!
        </h1>
        <p className="mb-1 text-gray-700">
          Thank you for your payment. Your subscription has been successfully
          processed. You have paid{" "}
          <span className="text-2xl font-semibold text-green-600 mx-1">
            {price}
          </span>{" "}
          and{" "}
          <span className="text-2xl font-semibold text-green-600 mx-1">
            {credits}
          </span>{" "}
        </p>

        <button
          className="px-10 py-3 text-md font-medium text-white bg-green-600 rounded hover:bg-green-700 mt-2"
          onClick={() => router.push("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Success;

// .bounce-in-top {
// 	-webkit-animation: bounce-in-top 1.1s both;
// 	        animation: bounce-in-top 1.1s both;
// }
