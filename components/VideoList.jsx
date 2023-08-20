import VideoCard from "./VideoCard";

// export async function getServerSideProps(context) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`);
//   const data = await res.json();

//   return {
//     props: {
//       videos: data.videos,
//     },
//   };
// }

const VideoList = ({ videos }) => {
  //console.log(videos);
  //console.log("VideoList debug: ", JSON.stringify(videos, null, 2));
  return (
    <div className="container mx-auto px-4 pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
        {videos.length >= 1
          ? videos.map((video) => <VideoCard key={video._id} video={video} />)
          : "No videos found. Please try again later."}
      </div>
    </div>
  );
};

export default VideoList;
