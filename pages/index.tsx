import Head from "next/head";
import Image from "next/image";
import clientPromise from "./api/lib/mongodb";
import { InferGetServerSidePropsType } from "next";
import { useSession, getSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import LoginButton from "../components/LoginButton";
import Link from "next/link";
import { GrFormCheckmark } from "react-icons/gr";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import nookie from "nookies";
import ContactUs from "../components/ContactUs";
import FAQ from "../components/FAQ.jsx";
import Footer from "../components/Footer";
import DemoPricing from "../components/DemoPricing";
const loadingSpinnerStyles = `
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
`;

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // console.log("Use session -------", session);

  useEffect(() => {
    if (!session) {
      const ref = nookie.get(null, "ref");
      const email = nookie.get(null, "email");

      // console.log("referral id:", { referral: ref });
      // console.log("user email:", { email });
    }
  }, []);
  console.log(
    session,
    "session session session session session session session session session session "
  );

  return (
    <>
      <Navigation />
      <div className="flex flex-col  items-center">
        <div className="w-full">
          <Head>
            <title>AdsReveal - Ad Spy</title>
            <link rel="icon" href="/favicon.ico" />
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`,
              }}
            />
            <script
              async
              src="https://r.wdfl.co/rw.js"
              data-rewardful="6e34fc"
            ></script>
          </Head>
          <main className="flex flex-col lg:-mt-40 justify-center items-center w-full flex-1 ">
            <div className="lg:flex block  container px-2 lg:py-0 sm:py-2 sm:pb-20 pb-10 px-0 sm:mt-6 mt-4 mx-auto lg:min-h-screen items-center  gap-6">
              <div className=" w-full">
                <p className="xl:text-2xl lg:text-xl lg:text-start text-center sm:text-xl uppercase lg:mb-0 sm:mb-4 mb-2 ">
                  Snapchat Ad Spy Tool
                </p>
                <h1 className="xl:text-5xl lg:text-4xl sm:text-3xl text-2xl lg:text-left text-center font-extrabold text-gray-900 xl:leading-[1.15] leading-[1.1]">
                  <span>Discover</span> Ads and{" "}
                  <span style={{ color: "blue" }}>Winning Products</span> on
                  Snapchat
                </h1>

                <ul className="flex flex-col xl:gap-3 lg:gap-2 justify-start items-start xl:text-xl lg:text-lg font-medium text-gray-700 xl:mt-8 lg:mt-5 sm:mt-4 mt-3 lg:p-0 sm:pl-10 pl-6">
                  <li className="flex items-center gap-3">
                    <span>
                      <span className="text-3xl text-blue-600 ">✔</span>
                    </span>
                    The One and Only Snapchat Ad Spy Tool
                  </li>
                  <li className="flex items-center gap-3">
                    <span>
                      <span className="text-3xl text-blue-600 ">✔</span>
                    </span>
                    The largest Snapchat Ads Library
                  </li>
                  <li className="flex items-center gap-3">
                    <span>
                      <span className="text-3xl text-blue-600 ">✔</span>
                    </span>
                    Unleash Your Advertising Potential with Snapchat
                  </li>
                  <li className="flex items-center gap-3">
                    <span>
                      <span className="text-3xl text-blue-600 ">✔</span>
                    </span>
                    Winning Products & Top Performing Ads
                  </li>
                </ul>
                <div className="w-[90%] mx-auto lg:hidden block mt-10 rounded-xl custom-shadow overflow-hidden sm:p-4 p-1 ">
                  <div style={{ width: "100%" }}>
                    <video
                      className="w-full"
                      width={"800"} // Set the desired width (e.g., 800)
                      height={"600"} // Set the desired height (e.g., 600)
                      loop
                      controls={false}
                      autoPlay
                      muted
                    >
                      <source src="/video/hero.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>

                <p className="xl:mt-9 lg:mt-6 mt-8 lg:text-left text-center"></p>
                <div className="mt-3 lg:block flex justify-center">
                  {!session && (
                    <button
                      onClick={() => router.push("/register")}
                      className="button"
                      id="GetStartedBtnTop"
                      style={{
                        width: "275px",
                        height: "60px",
                        fontSize: "25px",
                      }}
                    >
                      <span id="GetStartedBtnTop">Get Started</span>
                    </button>
                  )}
                  {session && (
                    <Link href={"/toplist"}>
                      <button
                        className="button"
                        id="GetStartedBtnTop"
                        style={{
                          width: "275px",
                          height: "60px",
                          fontSize: "25px",
                        }}
                      >
                        <span
                          style={{ fontSize: "25px" }}
                          id="GetStartedBtnTop"
                        >
                          Get Started
                        </span>
                      </button>
                    </Link>
                  )}
                </div>
              </div>
              <div className="w-full rounded-xl overflow-hidden px-4 py-4 custom-shadow lg:block hidden">
                <video
                  className="w-full h-full" // Set width and height to 100%
                  loop
                  controls={false}
                  autoPlay
                  muted
                  style={{ objectFit: "cover" }} // Maintain aspect ratio
                >
                  <source src="/video/hero.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
            <DemoPricing />
            <FAQ />
            <ContactUs></ContactUs>
            {/* <Testimonial /> */}
            {isConnected ? (
              <>
                {/* <span>Connected to MongoDB</span> */}
                {/* <LoginButton /> */}
              </>
            ) : (
              <h2 className="text-2xl mt-4 text-center mb-16 text-red-600">
                Database connection error, please contact support at
                support@adsreveal.com
              </h2>
            )}

            <div className="custom-gradient  w-full xl:py-20 lg:py-16 py-12 am:py-20">
              <div className="mx-auto container px-2 w-full xl:w-[60%] lg:w-[90%] sm:px-6 lg:px-10">
                <h3 className="text-center text-white leading-[1.15] xl:text-5xl lg:text-3xl sm:text-4xl text-3xl">
                  The largest Ads Library will become your best creative center
                </h3>
                <div className="text-center xl:mt-9 xl:mb-6 lg:mt-6  mt-4 mb-2 lg:mb-4">
                  {!session && (
                    <button
                      onClick={() => signIn("magiclink")}
                      className="text-secondary hover:opacity-90 duration-200 font-semibold lg:text-xl text-base xl:px-10 lg:px-7 lg:py-3 px-5 py-2 rounded-lg bg-white"
                    >
                      Get started - it's free
                    </button>
                  )}
                  {session && (
                    <Link href={"/toplist"}>
                      <button className="text-secondary hover:opacity-90 duration-200 font-semibold lg:text-xl text-base xl:px-10 lg:px-7 lg:py-3 px-5 py-2 rounded-lg bg-white">
                        Get started - it's free
                      </button>
                    </Link>
                  )}
                </div>
                <p className="text-white text-center lg:text-lg text-base">
                  Find your first viral ads & product. No credit card required.
                  No Commitment Needed.
                </p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    await clientPromise;
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}
