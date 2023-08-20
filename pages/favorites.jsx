import { getSession, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import VideoCard from "../components/VideoCard";
import Head from "next/head";

<Head>
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`,
    }}
  />
  <script async src="https://r.wdfl.co/rw.js" data-rewardful="6e34fc"></script>
</Head>;
export default function Favorites() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);

  const downloadVideo = async () => {
    const corsProxy = "https://cors-anywhere.herokuapp.com/";
    const response = await fetch(corsProxy + videoUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${randomFileName(10)}.mp4`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  useEffect(() => {
    async function fetchFavorites() {
      console.log("Fetching favorites...");
      const apiKey = session?.userData?.apiKey;
      console.log("API key:", apiKey);
      const response = await fetch(`/api/favorites?apiKey=${apiKey}`);
      console.log("Favorites API response:", response);
      const data = await response.json();
      console.log("Favorites data:", data);
      setFavorites(data.favorites);
      console.log("Response from favorites api: ", {
        videos: data.favorites,
        setFavorites: favorites,
      });
    }
    if (session?.userData?.apiKey) {
      fetchFavorites();
    }
  }, [session]);
console.log("session", session)
  const handleRemoveFavorite = async id => {
    console.log("Removing favorite...", id);
    const response = await fetch(
      `/api/favorites?apiKey=${session.userData.apiKey}&videoId=${id}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    console.log("Remove favorite API response:", data);
    setFavorites(prevFavorites =>
      prevFavorites.filter(favorite => favorite.id !== id)
    );
  };

  return (
    <>
      <Navigation />

      <div className="container mx-auto px-4 pt-6">
        <h1 className="text-3xl font-bold mb-8">Your Favorites</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
          {favorites && favorites.length >= 1 ? (
            favorites.map(favorite => (
              <>
                <div className="w-96 h-auto bg-gray-400 shadow-md rounded-md p-4 m-4 font-roboto">
                  <h2 className="text-xl font-bold mt-4 text-gray-800">
                    {favorite.data.ad_name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {favorite.data.ad_description}
                  </p>
                  <div className="text-sm mt-2">
                    <p className="font-semibold text-gray-800">Date Found:</p>
                    <p className="text-gray-600">{favorite.data.date_found}</p>
                  </div>
                  <div className="text-sm mt-2">
                    <p className="font-semibold text-gray-800">Tech:</p>
                    <p className="text-gray-600">{favorite.data.tech}</p>
                  </div>
                  <div className="text-sm mt-2">
                    <p className="font-semibold text-gray-800">Website:</p>
                    <a
                      href={`https://${favorite.data.website}`}
                      target="_blank"
                      className="text-gray-600"
                    >
                      {favorite.data.website}
                    </a>
                  </div>
                  <br />

                  <div className="w-full h-96 relative">
                    <video
                      className="w-full h-full absolute top-0 left-0 object-contain"
                      src={`https://advertisement-cdn-f23.b-cdn.net/${favorite.data.video_id}`}
                      controls
                    ></video>
                  </div>

                  {/* Add the download button */}
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={downloadVideo}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Download MP4
                    </button>
                    <button
                      onClick={() => handleRemoveFavorite(favorite.id)}
                      className={`ml-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-red-500 focus:outline-none focus:ring-yellow-500`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.5 6.5H20.5"
                        />
                        <path
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8.5 6.5V4.5C8.5 4.224 8.724 4 9 4H15C15.276 4 15.5 4.224 15.5 4.5V6.5M12.5 9.5V16.5"
                        />
                        <path
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6.5 6.5V20.5C6.5 20.776 6.724 21 7 21H17C17.276 21 17.5 20.776 17.5 20.5V6.5H6.5Z"
                        />
                        <path
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9.5 9.5L10.5 16.5"
                        />
                        <path
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M13.5 9.5L12.5 16.5"
                        />
                      </svg>
                    </button>
                  </div>
                  {/* End of download button */}
                </div>
              </>
            ))
          ) : (
            <p>No favorites yet!</p>
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
