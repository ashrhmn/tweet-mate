import { useState } from "react";
import { Tweet } from "react-twitter-widgets";

export default function ReTweetPostList({
  reTweetPostList,
  projectId,
}: {
  reTweetPostList: {
    id: string;
    tweetUrl: string;
    retweetOfProjectId: string;
    likeOfProjectId: string;
  }[];
  projectId: string;
}) {
  const [query, setQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tweetFound, setTweetFound] = useState(true);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="w-1/3">
      <button
        className="relative inline-block py-2 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-lime-900 to-pink-950 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
        onClick={handleSidebarToggle}
      >
        <span className="relative z-10">Add Re-Tweet Post</span>
        <span className="absolute top-0 left-0 w-full h-full bg-white opacity-10 rounded-lg filter blur-md -z-1 animate-pulse"></span>
      </button>
      {/* <Create
        key="create"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projectId={projectId}
        isRetweet={true}
        refetchProject={refetchProject}
      /> */}
      <div className="bg-blue-700 mt-1 py-2 text-white font-medium rounded-t text-center">
        Tweet Content
      </div>
      <div className="h-screen overflow-y-auto">
        <table className="w-full table-auto bg-blue-950 rounded-b shadow-lg border-collapse border-neutral-700 border">
          <tbody className="overflow-y-auto border-neutral-700">
            {/* {reTweetPostList.map((tweet) => (
              <tr key={tweet.id} className="border-b-4 border-neutral-600 ">
                <td className="max-h-10 py-2 px-4 text-white font-medium">
                  <TweetEmbed tweetUrl={tweet.tweetUrl} />
                </td>
              </tr>
            ))} */}

            <Tweet
              tweetId="1644569990648176641"
              renderError={() => <p>Tweet not found.</p>}
            />
            <tr>
              <td className="py-2 px-4 text-white font-medium">Data 2</td>
            </tr>
            <tr>
              <td className="py-2 px-4 text-white font-medium">Data 3</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
