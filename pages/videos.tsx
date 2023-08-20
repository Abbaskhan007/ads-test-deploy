import { useState, useEffect } from "react";
import VideoList from "../components/VideoList";
import { animateScroll as scroll } from "react-scroll";
import Navigation from "../components/Navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { serialize } from "cookie";
import Head from "next/head";

<Head>
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`,
    }}
  />
  <script async src="https://r.wdfl.co/rw.js" data-rewardful="6e34fc"></script>
</Head>;
// DO NOT USE, OLD

export default function Videos() {
  const { data: session, status } = useSession();
  // Search Data
  const [videos, setVideos] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  //const [apiKey, setApiKey] = useState("");
  const [queryRequest, setQueryRequest] = useState({});
  const [searchObject, setSearchObject] = useState({
    query: "",
    filter: "",
    apiKey: "",
    currentPage: 1,
    totalPages: 0,
    firstLoad: true,
    videos: [],
  });
  const [creditBalance, setCreditBalance] = useState("");
  const [submit, setSubmit] = useState(false);

  const router = useRouter();
  const apiKey = session?.user?.userData?.apiKey;

  useEffect(() => {
    // If user doesn't have api key, redirect to home page
    if (!apiKey) {
      router.replace("/");
    }
  }, [session, router]);

  useEffect(() => {
    getRecentVideos();
  }, [currentPage]);

  useEffect(() => {
    console.log("creditBalance:", creditBalance);
  }, [creditBalance]);

  useEffect(() => {
    if (session) {
      console.log("Current page: ", currentPage);
      console.log("Total pages: ", totalPages);
      //getRecentVideos();
      // fetch user's credit balance when component mounts
      //console.log("Session id:", session.user);
    } else {
      router.replace("/");
    }
  }, [session]);

  async function creditBalanceCheck() {
    if (session) {
      const apiKey = session?.user?.userData?.apiKey;
      console.log("Session apiKey:", apiKey);

      try {
        const response = await fetch(
          `${process.env.DOMAIN_NAME}/api/user?apiKey=${apiKey}`
        );
        const data = await response.json();
        console.log("Credit balance response:", data);
        setCreditBalance(data.credits);
        // console.log("Credit balance:", creditBalance);
      } catch (error) {
        console.error("Credit balance request error:", error);
      }
    } else {
      console.warn("No session available");
      router.replace("/");
    }
  }

  async function getRecentVideos() {
    // Wait for the credit balance to be retrieved
    await creditBalanceCheck();

    if (!session) {
      router.replace("/");
    }

    console.log("remainingCredits:", creditBalance);
    // console.log("session:", session);
    // console.log("user:", session.user);
    // console.log("apiKey:", session.user.userData.apiKey);

    // Proceed with API call
    console.log(
      `api call request url: /api/videos?&query=${query}&filter=${filter}&page=${currentPage}&key=${apiKey}`
    );
    const response = await fetch(
      `/api/videos?&query=${query}&filter=${filter}&page=${currentPage}&key=${apiKey}`
    );
    const data = await response.json();
    console.log("Data response from api: ", data);

    if (data.error) {
      setVideos([]);
      setTotalPages(0);
      // Display a message to the user informing them that the page they are looking for doesn't exist.
      return;
    }

    if (data.videos.length === 0) {
      setVideos([]);
      setTotalPages(0);
      console.log("No videos found");
    }

    console.log("Data response from api: ", data);
    setVideos(data.videos);
    console.log("videos state: ", videos);
    console.log("Setting total pages: ", data.totalPages);
    setTotalPages(data.totalPages);
    console.log("Total pages state: ", totalPages);
  }
  async function getVideos() {
    //`https://test-justindmo.vercel.app/api/db?q=${query}&filter=${filter}&page=${currentPage}&key=${apiKey}`
    const response = await fetch(
      `/api/db?q=${query}&filter=${filter}&page=${currentPage}&key=${apiKey}`
    );
    const data = await response.json();
    console.log("videos.jsx/getVideos() debug:\n", data);

    if (data.videos.length === 0) {
      setVideos([]);
      setTotalPages(0);
      console.log("No videos found");
      return;
    }

    setVideos(data.videos);
    setTotalPages(data.totalPages);
  }

  function handleNextPage() {
    creditBalanceCheck();
    // check user's credit balance before loading next page
    if (creditBalance === 0) {
      router.push("/payment"); // redirect to payment page if balance is 0
    } else {
      setCurrentPage((prevPage) => prevPage + 1);
      scroll.scrollToTop({ duration: 1000, smooth: "easeInOutQuart" });
      getRecentVideos();
    }
  }

  function handlePrevPage() {
    setCurrentPage((prevPage) => prevPage - 1);
    scroll.scrollToTop({ duration: 1000, smooth: "easeInOutQuart" });
  }
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    //console.log("input changed:", query);
    //setIsSearch(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("total pages: ", totalPages);
    if (creditBalance == 0) {
      router.push("/payment"); // redirect to payment page if balance is 0
    } else {
      setCurrentPage(1);

      await getRecentVideos();
      console.log("Query:", query);
      console.log("Filter:", filter);
      console.log("Form submitted", {
        Query: query,
        Filter: filter,
        Page: currentPage,
        apiKey: session.user.userData.apiKey,
      });
    }
  };

  return (
    <div>
      {creditBalance !== "" && creditBalance < 9 && (
        <div className="bg-yellow-100 px-6 py-4 rounded-md">
          <p className="text-yellow-800 font-bold">
            Attention! Insufficient credits
          </p>
          <p className="text-yellow-700">
            You need at least 9 credits to load a page of ads. Please purchase
            more credits to continue.
          </p>
          <a
            href="/payment"
            className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Purchase Credits
          </a>
        </div>
      )}
      <Navigation creditBalance={creditBalance} showCredits={true} />
      {/* {creditBalance <= 0 && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="bg-red-200 px-6 py-4 rounded-lg">
            <p className="text-red-800 font-bold">Insufficient credits</p>
            <p className="text-red-700">
              You do not have enough credits to view videos.
            </p>
            <p className="text-red-700">
              Please purchase more credits to continue.
            </p>
            <a
              href="/payment"
              className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Purchase Credits
            </a>
          </div>
        </div>
      )} */}
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
            {/* <option value="option2"></option>
            <option value="option3">Option 3</option> */}
          </select>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-gray-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Search
          </button>
        </form>
      </div>
      <br />
      <VideoList videos={videos} />
      <div className="flex justify-center my-8">
        {currentPage > 1 && (
          <button
            onMouseUp={handlePrevPage}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
          >
            Previous Page
          </button>
        )}
        {totalPages > currentPage && (
          <button
            onMouseUp={handleNextPage}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
          >
            Next Page
          </button>
        )}
      </div>
      {/* <div className="flex justify-center my-8">
        <p className="text-gray-700">Total results: {totalPages * 9}</p>
      </div> */}
    </div>
  );
}
