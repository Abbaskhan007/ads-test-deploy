import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";

const VideoCard = ({ video: initialVideo, favorites }) => {
  const session = useSession();

  const [blobUrl, setBlobUrl] = useState("");

  // console.log(
  //   "%c VideoCard component debug:",
  //   "color: #ff00ff; font-weight: bold"
  // );
  // console.log(favorites);
  const [isFavorited, setIsFavorited] = useState(false);
  const [video, setVideo] = useState({});
  //favorites?.find(favorite => favorite._id === video._id) !== undefined


  const handleFavoriteClick = async () => {
    const apiKey = session?.data.userData?.apiKey;
    console.log("-----", session);
    const { data } = await axios.post("/api/favorites", {
      apiKey: apiKey,
      videoId: video._id,
      isFavorited: !isFavorited,
      userId: session.data.id,
    });
    console.log("---- video", video);
    console.log("Favorite button clicked: ", {
      videoId: video._id,
      isFavorited: !isFavorited,
    });
    console.log("Response ", data);
    if (data?.success) {
      setIsFavorited(!isFavorited);
      setVideo(data.updatedVideo);
      console.log("Video favorite status updated successfully");
    } else {
      console.error("Error updating video favorite status");
    }
  };

  const videoUrl = `https://advertisement-cdn-f23.b-cdn.net/${video.video_id}`;

  const createBlobUrl = async () => {
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
  };

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

  const randomFileName = length => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };
  
  useEffect(() => {
    if (video?.likes?.includes(session.data?.id)) {
      setIsFavorited(true);
    } else {
      setIsFavorited(false);
    }
  }, [video]);

  useEffect(() => {
    setVideo(initialVideo);
  }, []);

  return (
    <div className="w-96 h-auto bg-gray-400 shadow-md rounded-md p-4 m-4 font-roboto">
      <h2 className="text-xl font-bold mt-4 text-gray-800">{video.ad_name}</h2>
      <p className="text-sm text-gray-600">{video.ad_description}</p>
      <div className="text-sm mt-2">
        <p className="font-semibold text-gray-800">Date Found:</p>
        <p className="text-gray-600">{video.date_found}</p>
      </div>
      <div className="text-sm mt-2">
        <p className="font-semibold text-gray-800">Tech:</p>
        <p className="text-gray-600">{video.tech}</p>
      </div>
      <div className="text-sm mt-2">
        <p className="font-semibold text-gray-800">Website:</p>
        <a
          href={`https://${video.website}/`}
          target="_blank"
          className="text-gray-600"
        >
          {`${video.website}`}
        </a>
      </div>
      <br />

      <div className="w-full h-96 relative">
        <video
          className="w-full h-full absolute top-0 left-0 object-contain"
          src={videoUrl}
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
          onClick={handleFavoriteClick}
          className={`ml-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-yellow-500 ${
            isFavorited
              ? "bg-gray-500 hover:bg-red-500"
              : "bg-yellow-500 hover:bg-yellow-400"
          }`}
        >
          {isFavorited ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
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
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.5 6.5V4.5C8.5 4.224 8.724 4 9 4H15C15.276 4 15.5 4.224 15.5 4.5V6.5M12.5 9.5V16.5"
              />
              <path
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.5 6.5V20.5C6.5 20.776 6.724 21 7 21H17C17.276 21 17.5 20.776 17.5 20.5V6.5H6.5Z"
              />
              <path
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.5 9.5L10.5 16.5"
              />
              <path
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 9.5L12.5 16.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 fill-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          )}
        </button>
      </div>
      {/* End of download button */}
    </div>
  );
};

export default VideoCard;
