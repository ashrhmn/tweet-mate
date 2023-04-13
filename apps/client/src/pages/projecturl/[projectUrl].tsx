import PublicLikeOfTweetPostList from "@/components/existingTweetPosts/publicLikeOfTweetPostList";
import PublicReTweetPostList from "@/components/existingTweetPosts/publicReTweetPostList";
import PublicNewTweetPostList from "@/components/newTweetPosts/publicNewTweetPostList";
import service from "@/service";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "api-interface";
import { useRouter } from "next/router";

const getProjectByUrl = (url: string) =>
  service(endpoints.projects.getProjectByUrl)({ param: { url } });

export default function ProjectDetails() {
  const param = useRouter();
  const projectUrl =
    typeof param.query.projectUrl === "string" ? param.query.projectUrl : null;

  const {
    data: projectByUrl,
    status: getProjectByUrlStatus,
    refetch: refetchProject,
  } = useQuery({
    queryKey: ["getProjectByUrl"],
    queryFn: () => getProjectByUrl(projectUrl!),
    enabled: !!projectUrl,
  });

  if (getProjectByUrlStatus === "loading") return <div>Loading...</div>;
  if (getProjectByUrlStatus === "error") return <div>Project not found</div>;

  //console.log(project.retweetPosts);

  return (
    <div>
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-4xl font-bold leading-10 text-gray-900 sm:text-5xl sm:leading-none sm:truncate">
                {projectByUrl?.name}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <br />

      <div>
        <div className="flex flex-wrap justify-center">
          <PublicNewTweetPostList
            newTweetPostList={projectByUrl.newTweetPosts}
          />
          <PublicReTweetPostList reTweetPostList={projectByUrl.retweetPosts} />
          <PublicLikeOfTweetPostList
            likeOfTweetPostList={projectByUrl.likeTweets}
          />
        </div>
      </div>
    </div>
  );
}
