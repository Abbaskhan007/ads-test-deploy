import Navigation from "../components/Navigation";
import { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";

<Head>
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`,
    }}
  />
  <script async src="https://r.wdfl.co/rw.js" data-rewardful="6e34fc"></script>
</Head>;
//////////// remove this one

export default function Profile({ user }) {
  const [userData, setUserData] = useState(user?.userData || {});
  const { data } = useSession();
  const [stripeData, setStripeData] = useState();
  const router = useRouter();

  console.log("Profile page debug:\n", user);
  const getUser = async () => {
    const { data } = await axios.get(`/api/getUser?email=${user?.email}`);
    setStripeData(data);
    console.log("Data ------", data);
    //console.log("*** subscription", data.userData.stripeData[9].subscription);
  };
  useEffect(() => {
    getUser();
  }, [userData]);

  useEffect(() => {
    setUserData(user.userData || {});
  }, [user]);
  const cancelSubscription = async () => {
    router.push("https://billing.stripe.com/p/login/14k03kb35ayceHe5kk");
    // const data = await axios.put("/api/cancelSubscription", {
    //   subscriptionId: stripeData.userData.stripeData.subscription,
    // });

    // console.log("Cancel subscription", data);
    // await getUser();
  };
  console.log("user data: ", userData);
  const referredBy =
    userData.referredBy === user.email ? "Yourself" : userData?.referredBy;

  return (
    <div className="min-h-screen bg-light-gray">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Profile
        </h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-10 py-10 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Referral URL
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  https://app.adsreveal.com/register?code=
                  {userData?.userReferralId}
                </dd>
              </div>
              {/* <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  First Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {data?.firstName}
                </dd>
              </div> */}
              {/* <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{data?.lastName}</dd>
              </div> */}
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Subscription Type
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {stripeData?.userData?.subscribed
                    ? stripeData?.userData?.subscriptionType
                    : "Free"}
                </dd>
              </div>
              {stripeData?.userData?.subscribed ? (
                <button
                  className="bg-red-600 text-white rounded-sm"
                  onClick={cancelSubscription}
                >
                  Manage Subscription
                </button>
              ) : (
                <button
                  onClick={() => router.push("/payment")}
                  className="bg-blue-500 text-white rounded-sm"
                >
                  Subscribe
                </button>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

//////////// UNcommit this after changes

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  console.log("session ", session);
  return {
    props: {
      user: session.user,
    },
  };
}
