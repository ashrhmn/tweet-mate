import service from "@/service";
import { handleReqError } from "@/utils/error.utils";
import { promiseToast } from "@/utils/toast.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { endpoints } from "api-interface";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createProjectSchema = endpoints.projects.create.bodySchema;

type ICreateProjectData = z.infer<typeof createProjectSchema>;

export default function Create({
  isOpen,
  onClose,
  refetchProjects,
}: {
  isOpen: boolean;
  onClose: () => void;
  refetchProjects: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateProjectData>({
    resolver: zodResolver(createProjectSchema),
  });

  const handleCreateProject = async (data: ICreateProjectData) => {
    try {
      await promiseToast(
        service(endpoints.projects.create)({
          body: data,
        }).then(refetchProjects),
        {
          loading: "Adding Project...",
          success: "Project Added",
        },
      ).catch(handleReqError);
    } catch (error) {
      handleReqError(error);
    }
  };

  return (
    <div
      className={`fixed inset-0 overflow-hidden transition-all ease-in-out duration-300 z-30 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="h-full p-8  bg-white bg-opacity-50 backdrop-filter backdrop-blur-md overflow-y-auto flex items-center justify-center">
            <button
              className="absolute top-0 left-0 m-4 p-2 rounded-full text-gray-800 hover:bg-gray-300"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="h-screen flex items-center">
              <div>
                <h2 className="text-lg font-medium mb-4 text-gray-800">
                  Create Project
                </h2>
                <form
                  className="bg-white bg-opacity-70 space-y-6 border-2 border-gray-200 rounded-md p-4"
                  onSubmit={handleSubmit(handleCreateProject)}
                >
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Name / Title
                    </label>
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 border-gray-200"
                      placeholder="Name"
                      {...register("name")}
                    />
                    <p className="text-error">{errors.name?.message}</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Public Page Url (Optional)
                    </label>
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 border-gray-200"
                      placeholder="url"
                      {...register("url")}
                    />
                    <p className="text-error">{errors.url?.message}</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Description
                    </label>
                    <textarea
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 border-gray-200"
                      placeholder="Description..."
                      {...register("description")}
                    />
                    <p className="text-error">{errors.description?.message}</p>
                  </div>

                  <div>
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
