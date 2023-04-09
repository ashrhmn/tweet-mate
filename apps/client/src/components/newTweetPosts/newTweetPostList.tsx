import service from "@/service";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "api-interface";
import { useMemo, useState } from "react";
import { Share } from "react-twitter-widgets";
import Create from "./createNewTweetPostForm";

const getNewTweetPostsByProjectId = (projectId: string) =>
  service(endpoints.newTweetPosts.getAllByProjectId)({ param: { projectId } });

export default function NewTweetPostList({ projectId }: { projectId: string }) {
  const [query, setQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const {
    data: getNewTweetPosts,
    status: getNewTweetPostsStatus,
    refetch: refetchNewTweetPosts,
  } = useQuery({
    queryKey: ["getNewTweetPosts"],
    queryFn: () => getNewTweetPostsByProjectId(projectId!),
    enabled: !!projectId,
  });

  const filteredNewTweetPosts = useMemo(() => {
    if (!getNewTweetPosts) return [];
    if (!query) return getNewTweetPosts;
    return getNewTweetPosts.filter((newTweetPost) =>
      newTweetPost.id.toLowerCase().includes(query),
    );
  }, [getNewTweetPosts, query]);

  if (getNewTweetPostsStatus === "loading") return <div>Loading...</div>;
  if (getNewTweetPostsStatus === "error")
    return <div>New Tweet Posts not found</div>;

  return (
    <div className="w-1/3 px-2">
      <button
        className="relative inline-block py-2 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-lime-900 to-pink-950 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
        onClick={handleSidebarToggle}
      >
        <span className="relative z-10">Create New Content</span>
        <span className="absolute top-0 left-0 w-full h-full bg-white opacity-10 rounded-lg filter blur-md -z-1 animate-pulse"></span>
      </button>
      <Create
        key="create"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projectId={projectId}
        refetchNewTweetPosts={refetchNewTweetPosts}
      />
      <div className="bg-purple-800 mt-1 py-2 text-white font-medium rounded-t text-center">
        Tweet Content
      </div>
      <div className="h-screen overflow-y-auto">
        <table className="w-full table-auto bg-purple-950 rounded-b shadow-lg border-collapse border-neutral-700 border">
          <tbody className="overflow-y-auto border-neutral-700">
            {getNewTweetPosts.map((tweet) => (
              <tr key={tweet.id} className="border-b-4 border-neutral-600 ">
                <td className="py-2 px-5 text-white font-medium">
                  <div>
                    <div className="flex items-center space-x-3">
                      <img
                        className="w-10 h-10 rounded-full"
                        src="https://picsum.photos/seed/picsum/200"
                        alt="Profile"
                      />
                      <textarea
                        className="w-full h-28 p-2 text-sm font-normal text-zinc-950 bg-gray-100 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="What's happening?"
                        value={tweet.content!}
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <Share
                        url=""
                        options={{
                          size: "large",
                          text: tweet.content,
                          via: "",
                        }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
