import { useState } from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";

export default function PublicLikeOfTweetPostList({
  likeOfTweetPostList,
  projectId,
  refetchProject,
}: {
  likeOfTweetPostList: {
    id: string;
    tweetUrl: string;
    retweetOfProjectId: string | null;
    likeOfProjectId: string | null;
  }[];
  projectId: string;
  refetchProject: () => void;
}) {
  const [query, setQuery] = useState("");
  const [tweetFound, setTweetFound] = useState(true);

  return (
    <div className="w-full sm:w-1/3 p-4">
      <div className="bg-green-700 mt-1 py-2 text-white font-medium rounded-t text-center">
        Like Of Tweet
      </div>
      <div className="h-screen overflow-y-auto">
        <table className="w-full table-auto  bg-green-900 rounded-b shadow-lg border-collapse border-neutral-700 border">
          <tbody className="overflow-y-auto border-neutral-700">
            {likeOfTweetPostList.map((tweet) => {
              const match = tweet.tweetUrl.match(/\/(\d+)\?/);
              return (
                <tr key={tweet.id} className="border-b-4 border-neutral-600 ">
                  <td className="max-h-10 py-2 px-4 text-white font-medium">
                    {match ? (
                      <TwitterTweetEmbed tweetId={match[1]} />
                    ) : (
                      `Invalid Url : [${tweet.tweetUrl}]`
                    )}
                  </td>
                </tr>
              );
            })}

            {/* {tweetFound ? (
              <TwitterTweetEmbed tweetId="1644569990648176641" />
            ) : (
              <p>Tweet not found.</p>
            )} */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
