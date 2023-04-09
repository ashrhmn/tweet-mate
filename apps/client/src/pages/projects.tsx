import ErrorView from "@/components/common/ErrorView";
import Create from "@/components/projects/CreateProjectForm";
import service from "@/service";
import { handleReqError } from "@/utils/error.utils";
import { promiseToast } from "@/utils/toast.utils";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "api-interface";
import Link from "next/link";
import { useMemo, useState } from "react";

const Projects = () => {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userID, setUserID] = useState("");
  const [query, setQuery] = useState("");

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditClick = (id: string) => {
    setIsEditFormOpen(true);
    setUserID(id);
  };

  const handleFormClose = () => {
    setIsEditFormOpen(false);
  };

  const {
    data: getProjects,
    status: getProjectsStatus,
    refetch: refetchProjects,
    error: getProjectsError,
  } = useQuery({
    queryKey: ["getProjects"],
    queryFn: () => service(endpoints.projects.getAll)({}),
  });

  const filteredProjects = useMemo(() => {
    if (!getProjects) return [];
    if (!query) return getProjects;
    return getProjects.filter((project) =>
      project.name.toLowerCase().includes(query),
    );
  }, [getProjects, query]);

  if (getProjectsStatus === "loading") return <div>Loading...</div>;
  if (getProjectsStatus === "error")
    return <ErrorView error={getProjectsError} />;

  const handleDeleteProject = async (id: string) => {
    await promiseToast(
      service(endpoints.projects.delete)({
        param: { id },
      }).then(() => refetchProjects),
      {
        loading: "Deleting Project....",
        success: "Project Deleted",
      },
    ).catch(handleReqError);
  };

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  return (
    <>
      <div className="w-full">
        <button
          className="relative inline-block py-2 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
          onClick={handleSidebarToggle}
        >
          <span className="relative z-10">Create Project</span>
          <span className="absolute top-0 left-0 w-full h-full bg-white opacity-10 rounded-lg filter blur-md -z-1 animate-pulse"></span>
        </button>
        <Create
          key="create"
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          refetchProjects={refetchProjects}
        />
        <br />
        <br />
        <div className="w-full rounded-lg shadow-lg">
          <div className="w-full">
            <div className="flex justify-between items-center bg-gradient-to-r from-purple-900 to-purple-700 px-4 py-3">
              <h1 className="text-white font-bold text-lg">Projects</h1>
              <input
                type="text"
                placeholder="Search"
                className="px-3 py-1 text-gray-700 border-2 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-purple-600 
              focus:border-transparent"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <table className="w-full whitespace-no-wrap table-auto">
              <thead>
                <tr
                  className="text-xs font-semibold tracking-wide text-left 
                text-white uppercase border-b bg-gradient-to-r from-purple-900 to-purple-700"
                >
                  <th className="px-4 py-3">Name / Title</th>
                  <th className="px-4 py-3">URL</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="overflow-auto max-h-screen bg-gray-100 ">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="text-gray-600">
                    <td className="px-4 py-3 text-ms font-semibold border">
                      <Link
                        href={`project/${project.id}`}
                        className=" hover:text-pink-800"
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold border whitespace-nowrap">
                      <div className="flex items-center">
                        <a
                          href={origin + "/" + project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {origin + "/" + project.url}
                        </a>
                        <svg
                          className="ml-2 hover:bg-blue-400 text-blue-900 font-bold rounded w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              origin + "/" + project.url,
                            );
                          }}
                        >
                          <path d="M17 21H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6a1 1 0 0 1 0 2H7v12h10V9h2a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2z"></path>
                        </svg>
                      </div>
                    </td>
                    <td className="px-4 py-3 border">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="text-sm font-medium">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold border whitespace-nowrap">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleEditClick(project.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                        onClick={() => {
                          if (window.confirm("Want to delete the project?")) {
                            handleDeleteProject(project.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* {isEditFormOpen && (
          <Update
            key={userID}
            userID={userID}
            handleFormClose={handleFormClose}
            refetchUsers={refetchUsers}
          />
        )} */}
      </div>
      <br />
      <br />
    </>
  );
};

export default Projects;
