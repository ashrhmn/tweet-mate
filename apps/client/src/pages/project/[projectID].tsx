import LikeOfTweetPostList from "@/components/existingTweetPosts/likeOfTweetPostList";
import ReTweetPostList from "@/components/existingTweetPosts/reTweetPostList";
import NewTweetPostList from "@/components/newTweetPosts/newTweetPostList";
import service from "@/service";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "api-interface";
import { useRouter } from "next/router";

const getProjectById = (id: string) =>
  service(endpoints.projects.getProject)({ param: { id } });

export default function ProjectDetails() {
  const param = useRouter();
  const projectID =
    typeof param.query.projectID === "string" ? param.query.projectID : null;

  const {
    data: project,
    status: getProjectStatus,
    refetch: refetchProject,
  } = useQuery({
    queryKey: ["getProject"],
    queryFn: () => getProjectById(projectID!),
    enabled: !!projectID,
  });

  if (getProjectStatus === "loading") return <div>Loading...</div>;
  if (getProjectStatus === "error") return <div>Project not found</div>;

  //console.log(project.retweetPosts);

  return (
    <div>
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-28 pb-10 md:pt-16 md:pb-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-4xl font-bold leading-10 text-gray-900 sm:text-5xl sm:leading-none sm:truncate">
                  {project?.name}
                </h2>
                {/* <div className="mt-4 flex flex-wrap">
                  <div className="flex items-center text-sm leading-5 text-gray-500 mr-6">
                    <svg
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Project Client Here
                  </div>
                  <div className="flex items-center text-sm leading-5 text-gray-500">
                    <svg
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Project Date Here
                  </div>
                </div> */}
              </div>
              <div className="mt-5 flex lg:mt-0 lg:ml-4">
                <span className="hidden sm:block">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-500 focus:outline-none focus:shadow-outline-purple focus:border-purple-700 active:bg-purple-700 transition duration-150 ease-in-out"
                  >
                    Edit
                  </button>
                </span>
                <span className="ml-3 inline-flex rounded-md shadow-sm">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-purple-700 bg-purple-100 hover:text-purple-500 hover:bg-purple-50 focus:outline-none focus:shadow-outline-purple focus:border-purple-300 active:bg-purple-200 transition duration-150 ease-in-out"
                  >
                    Delete
                  </button>
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Project Description
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
                  {project?.description
                    ? project.description
                    : "....Description not found"}
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 col-gap-4 row-gap-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm leading-5 font-medium text-gray-500">
                      Project Author
                    </dt>
                    <dd className="mt-1 text-sm leading-5 text-gray-900">
                      {project?.author.username}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm leading-5 font-medium text-gray-500">
                      Public Page URL
                    </dt>
                    <dd className="mt-1 text-sm leading-5 text-gray-900">
                      <a
                        href={
                          window.location.origin + "/projecturl/" + project.url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {window.location.origin + "/projecturl/" + project.url}
                      </a>
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm leading-5 font-medium text-gray-500">
                      Team
                    </dt>
                    <dd className="mt-1 text-sm leading-5 text-gray-900">
                      John Doe, Jane Smith
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm leading-5 font-medium text-gray-500">
                      Project Status
                    </dt>
                    <dd className="mt-1 text-sm leading-5 text-gray-900">
                      In Progress
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />
      <br />
      <br />

      <div>
        <div className="flex flex-wrap justify-center">
          <NewTweetPostList projectId={project.id} />
          <ReTweetPostList
            reTweetPostList={project.retweetPosts}
            projectId={project.id}
            refetchProject={refetchProject}
          />
          <LikeOfTweetPostList
            likeOfTweetPostList={project.likeTweets}
            projectId={project.id}
            refetchProject={refetchProject}
          />
        </div>
      </div>
    </div>
  );
}

// const NewTweetPosts = ({ projectId }: { projectId: string }) => {
//   const [query, setQuery] = useState("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [text, setText] = useState("");

//   const handleSidebarToggle = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const {
//     data: getNewTweetPosts,
//     status: getNewTweetPostsStatus,
//     refetch: refetchNewTweetPosts,
//   } = useQuery({
//     queryKey: ["getNewTweetPosts"],
//     queryFn: () => getNewTweetPostsByProjectId(projectId!),
//     enabled: !!projectId,
//   });

//   const filteredNewTweetPosts = useMemo(() => {
//     if (!getNewTweetPosts) return [];
//     if (!query) return getNewTweetPosts;
//     return getNewTweetPosts.filter((newTweetPost) =>
//       newTweetPost.id.toLowerCase().includes(query),
//     );
//   }, [getNewTweetPosts, query]);

//   if (getNewTweetPostsStatus === "loading") return <div>Loading...</div>;
//   if (getNewTweetPostsStatus === "error")
//     return <div>New Tweet Posts not found</div>;

//   return (
//     <div>
//       <div className="flex justify-stretch">

//

//         <div className="w-1/3 px-2">
//           <button
//             className="relative inline-block py-2 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-lime-900 to-pink-950 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
//             onClick={handleSidebarToggle}
//           >
//             <span className="relative z-10">Add Tweet to Like</span>
//             <span className="absolute top-0 left-0 w-full h-full bg-white opacity-10 rounded-lg filter blur-md -z-1 animate-pulse"></span>
//           </button>
//           <Create
//             key="create"
//             isOpen={isSidebarOpen}
//             onClose={() => setIsSidebarOpen(false)}
//             projectId={projectId}
//             refetchNewTweetPosts={refetchNewTweetPosts}
//           />
//           <br />
//           <table className="w-full bg-green-400 rounded-lg shadow-lg border-collapse border">
//             <thead className="bg-green-900">
//               <tr>
//                 <th className="py-2 text-white font-medium">Tweet Content</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="border-b-4 border-neutral-300 ">
//                 <td className="py-2 px-4 text-white font-medium">Data 2</td>
//               </tr>
//               <tr className="border-b-4 border-neutral-300 ">
//                 <td className="py-2 px-4 text-white font-medium">Data 2</td>
//               </tr>
//               <tr>
//                 <td className="py-2 px-4 text-white font-medium">Data 3</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//       <br />
//       <br />
//     </div>
//   );
// };
