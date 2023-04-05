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

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-32 pb-12 md:pt-20 md:pb-12">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-4xl font-bold leading-10 text-gray-900 sm:text-5xl sm:leading-none sm:truncate">
                {project?.name}
              </h2>
              <div className="mt-4 flex flex-wrap">
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
              </div>
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
                    URL (Tweet Link)
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900">
                    <a
                      href={project?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {project?.url}
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
  );
}
