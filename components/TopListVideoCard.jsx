import Image from "next/image";
import Link from "next/link";

export default function TopListVideoCard({
  id,
  title,
  description,
  dateFound,
  tech,
  website,
  videoUrl,
}) {
  return (
    <div className="w-96 h-auto bg-gray-400 shadow-md rounded-md p-4 m-4 font-roboto">
      <h2 className="text-xl font-bold mt-4 text-gray-800">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <div className="text-sm mt-2">
        <p className="font-semibold text-gray-800">Date Found:</p>
        <p className="text-gray-600">{dateFound}</p>
      </div>
      <div className="text-sm mt-2">
        <p className="font-semibold text-gray-800">Tech:</p>
        <p className="text-gray-600">{tech}</p>
      </div>
      <div className="text-sm mt-2">
        <p className="font-semibold text-gray-800">Website:</p>
        <a
          href={`https://${website}`}
          target="_blank"
          className="text-gray-600"
        >
          {website}
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
    </div>
  );
}
