import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import VideoCard from "../components/VideoCard";
import TopListVideoCard from "../components/TopListVideoCard";
import Head from "next/head";
import { useDetectAdBlock } from "adblock-detect-react";
import AdBlockModal from "../components/AdBlockModal";
import { getSession } from "next-auth/react";

<Head>
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`,
    }}
  />
  <script async src="https://r.wdfl.co/rw.js" data-rewardful="6e34fc"></script>
</Head>;

export default function TopList() {
  const [topList, setTopList] = useState([]);
  const adBlockDetected = useDetectAdBlock();

  useEffect(() => {
    async function fetchTopList() {
      console.log("Fetching top list...");
      const response = await fetch(`/api/toplist`);
      console.log("Top list API response:", response);
      const data = await response.json();
      console.log("Top list data:", data);
      setTopList(data);
    }
    fetchTopList();
  }, []);

  return (
    <>
      <Navigation />
      {adBlockDetected && <AdBlockModal />}

      <div className="container mx-auto px-4 pt-6">
        <h1 className="text-3xl font-bold mb-8">Top 9 Most Favorited Ads</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
          {topList && topList.length >= 1 ? (
            topList.map(ad => (
              <TopListVideoCard
                key={ad._id}
                id={ad._id}
                title={ad.ad_name}
                description={ad.ad_description}
                dateFound={ad.date_found}
                tech={ad.tech}
                website={ad.website}
                videoUrl={`https://advertisement-cdn-f23.b-cdn.net/${ad.video_id}`}
              />
            ))
          ) : (
            <p>No ads found!</p>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user,
    },
  };
}
