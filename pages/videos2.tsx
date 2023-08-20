"use client";
import { useState, useEffect } from "react";
import { animateScroll as scroll } from "react-scroll";
import Navigation from "../components/Navigation";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import VideoCard from "../components/VideoCard";
import nookies from "nookies";
import Head from "next/head";
import { useDetectAdBlock } from "adblock-detect-react";
import AdBlockModal from "../components/AdBlockModal";
import { Modal } from "antd";
import DatePickerModal from "../components/DatePickerModal";
import { formatDateString } from "../utils/utils";

<Head>
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`,
    }}
  />
  <script async src="https://r.wdfl.co/rw.js" data-rewardful="6e34fc"></script>
</Head>;
export default function Videos() {
  const { data: session, status } = useSession();
  const [creditBalance, setCreditBalance] = useState("");
  const [videos, setVideos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteVideos, setFavoriteVideos] = useState([]);
  const [user, setUser] = useState("");
  const [initialEffect, setInitEffect] = useState(false); // check if the initial useEffect has been called
  const adBlockDetected = useDetectAdBlock();
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date("2000-01-01"));
  const [endDate, setEndDate] = useState(new Date());
  const [isDateChanged, setIsDateChanged] = useState(false)
  const [isFilterClear, setIsFilterClear] = useState(false)

console.log("endDate -----", endDate)
  // v2
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  console.log("session *************: ", session);

  useEffect(() => {
    async function fetchCredits() {
      const session = await getSession();

      setCreditBalance(session?.userData?.credits);
    }
    fetchCredits();
  }, []);

  // initial effect
  useEffect(() => {
    if (session && session.user) {
      setUser(session.userData);
      //console.log("USER SET: ", user);
      const ref = nookies.get(undefined, "ref");
      //   console.log("Referral ID:", ref);
      if (ref) {
        fetch("/api/referral", {
          method: "POST",
          body: JSON.stringify({ email: session.user.email, referralId: ref }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error(error));
      }
    }
    if (!session) {
      router.replace("/");
      return;
    }
    if (!session || !session.user || status === "unauthenticated") {
      router.push("/");
      return;
    }

    

    async function getData() {
      await fetchUserCredits();
      const videos = await fetchDefaultVideos();
      await fetchUserFavoriteVideos();

      setVideos(videos);

      //console.log("This is your session: ", session);
      // console.log("This is user: ", user);
      // console.log("This is your credit balance: ", creditBalance);
    }

    if (user && !initialEffect) {
      getData();
      setInitEffect(true);
    }
  }, [session, user]);

  useEffect(() => {
    fetchVideos();
  }, [currentPage]);

  useEffect(() => {
    console.log("New videos data change: ", { videos: videos });
  }, [videos]);

  async function fetchDefaultVideos() {
    return fetch("/api/videos2?type=default").then(response => response.json());
  }

  async function fetchUserCredits() {
    console.log("this is user: ", user);
    const response = await fetch(
      `/api/user?apiKey=${session?.userData?.apiKey}`
    );
    const data = await response.json();
    const creditBalance = data.credits;
    console.log("FETCHING USER CREDITS: ", creditBalance);
    setCreditBalance(creditBalance);
    return creditBalance;
  }

  async function fetchUserFavoriteVideos() {
    console.log(favoriteVideos);
    //const response = await fetch(`/api/favorites?apiKey=${user.apiKey}`);
    //const data = await response.json();
    setFavoriteVideos(user.favorites);
    console.log("Favorite videos: ", favoriteVideos);
  }
  async function fetchVideos() {
    if (!session) {
      router.replace("/");
      return;
    }

    setLoading(true); // set loading to true
    console.log("testing api key problem: ", user);
    const formattedStartDate = formatDateString(startDate);
    const formattedEndDate = formatDateString(endDate);
    console.log("Formatted Date -----", formattedStartDate, formattedEndDate);
    const response = await fetch(
      `/api/videos?&query=${query}&filter=${filter}&page=${currentPage}&key=${session?.userData?.apiKey}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
    const data = await response.json();

    console.log("This is the data from the api query: ", data);
    console.log("CURRENT PAGE JUST SENT: ", currentPage);

    if (data.error) {
      setVideos([]);
      setTotalPages(0);
      setLoading(false);
      return;
    }

    if (data.videos.length === 0) {
      setVideos([]);
      setTotalPages(0);
      console.log("No videos found");
    }

    setVideos(data.videos);
    setTotalPages(data.totalPages);

    await fetchUserCredits();

    setLoading(false);
  }
  async function handleNextPage() {
    if (creditBalance < 9) {
      router.push("/payment");
    } else {
      setCurrentPage(prevPage => prevPage + 1);
      scroll.scrollToTop({ duration: 500, smooth: "easeInOutQuart" });
    }
  }
  async function handlePrevPage() {
    if (creditBalance < 9) {
      router.push("/payment");
    } else {
      setCurrentPage(prevPage => prevPage - 1);
      scroll.scrollToTop({ duration: 500, smooth: "easeInOutQuart" });
    }
  }

  const handleSubmit = async e => {
    if (creditBalance == 0) {
      router.push("/payment");
      return;
    }
    e.preventDefault();
    setCurrentPage(1);
    //setIsSearch(!isSearch);
    //setFirstLoad(false);
    await fetchVideos();
    await fetchUserCredits();
  };

  const handleInputChange = e => {
    setQuery(e.target.value);
    //console.log("input changed:", query);
    //setIsSearch(true);
  };
  const handleFilterChange = e => {
    setFilter(e.target.value);
  };

  // const onClear = () => {
  //   setQuery("");
  //   setFilter("")
  //   setStartDate(new Date("2000-01-01"));
  //   setEndDate(new Date());
  //   setIsDateChanged(false);
  //   setIsFilterClear(prev=>!prev)
  // }

  // useEffect(()=>{
  // fetchVideos()
  // },[isFilterClear])

 

  return (
    <>
      <Navigation />
      {adBlockDetected && <AdBlockModal />}
      <p className="text-black justify-center text-center mt-6 bg-sky-200 p-2 w-[200px] rounded-md mx-auto">
        Ad Views Remaining: {creditBalance !== "" ? creditBalance : "Loading..."}
      </p>
      {creditBalance !== "" && creditBalance < 9 && (
        <div className="bg-yellow-100 px-6 py-4 rounded-md">
          <p className="text-yellow-800 font-bold">
            Attention! Insufficient ad views
          </p>
          <p className="text-yellow-700">
            You need at least 9 ad views to search, paginate, or filter for ads.
            Please purchase more ad views to continue.{" "}
            <a
              href="/payment"
              className="ml-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Purchase Ad Views
            </a>
          </p>
        </div>
      )}

      {creditBalance >= 9 && (
        <div className="flex items-center justify-center pt-6">
          <form className="flex justify-center items-center my-4">
            <input
              value={query}
              onChange={handleInputChange}
              type="text"
              placeholder="Search videos"
              className="border border-gray-400 rounded py-2 px-3 mr-2 leading-tight focus:outline-none focus:shadow-outline"
            />
            <select
              value={filter}
              onChange={handleFilterChange}
              className="border border-gray-400 rounded py-2 px-3 mr-2 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="all">ecom platform</option>
              <option value="shopify">Shopify</option>
            </select>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="bg-gray-800 mr-2 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Date Filter
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-gray-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Search
            </button>
            {/* <button
            disabled={!query && !filter  && !isDateChanged}
              type="button"
              onClick={onClear}
              className="disabled:hidden ml-2 bg-gray-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Clear Filter
            </button> */}
          </form>
          <DatePickerModal
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            open={open}
            setOpen={setOpen}
            setIsDateChanged={setIsDateChanged}
          />
        </div>
      )}

      <div className="container mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
          {loading ? (
            <p>Loading...</p>
          ) : videos && videos.length >= 1 ? (
            videos.map(video => (
              <VideoCard
                key={video._id}
                video={video}
                favorites={favoriteVideos}
              />
            ))
          ) : (
            <p>No videos found</p>
          )}
        </div>
      </div>
      <div className="flex justify-center my-8">
        {currentPage > 1 && (
          <button
            onClick={handlePrevPage}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
          >
            Previous Page
          </button>
        )}
        {totalPages > currentPage && (
          <button
            onClick={() => handleNextPage(creditBalance)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
          >
            Next Page
          </button>
        )}
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
