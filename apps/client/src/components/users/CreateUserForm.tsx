import service from "@/service";
import { handleReqError } from "@/utils/error.utils";
import { promiseToast } from "@/utils/toast.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "api-interface";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createUserSchema = endpoints.users.create.bodySchema;

type ICreateUserData = z.infer<typeof createUserSchema>;

export default function Create({
  isOpen,
  onClose,
  refetchUsers,
}: {
  isOpen: boolean;
  onClose: () => void;
  refetchUsers: () => void;
}) {
  const { data: allPermissions } = useQuery({
    queryKey: ["user-permissions"],
    queryFn: () => service(endpoints.users.getAllPermissions)({}),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<ICreateUserData>({
    defaultValues: {
      permissions: [],
    },
    resolver: zodResolver(createUserSchema),
  });

  const handleCreateUser = async (data: ICreateUserData) => {
    try {
      await promiseToast(
        service(endpoints.users.create)({
          body: data,
        })
          .then(refetchUsers)
          .catch(handleReqError),
        {
          loading: "Adding User...",
          success: "User Added",
        },
      );
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
                  Sign Up
                </h2>
                <form
                  className="bg-white bg-opacity-70 space-y-6 border-2 border-gray-200 rounded-md p-4"
                  onSubmit={handleSubmit(handleCreateUser)}
                >
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 border-gray-200"
                      placeholder="Username"
                      {...register("username")}
                    />
                    <p className="text-error">{errors.username?.message}</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 border-gray-200"
                      placeholder="Password"
                      {...register("password")}
                    />
                    <p className="text-error">{errors.password?.message}</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 border-gray-200"
                      placeholder="Confirm Password"
                      {...register("confirmPassword")}
                    />
                    <p className="text-error">
                      {errors.confirmPassword?.message}
                    </p>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      Permissions
                    </label>
                    {allPermissions?.map((p) => (
                      <div key={p} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-green-500"
                          defaultChecked={getValues("permissions").includes(p)}
                          onChange={(e) =>
                            e.target.checked
                              ? setValue("permissions", [
                                  ...getValues("permissions"),
                                  p,
                                ])
                              : setValue(
                                  "permissions",
                                  getValues("permissions").filter(
                                    (perm) => perm !== p,
                                  ),
                                )
                          }
                        />
                        <span className="ml-2 text-gray-700">{p}</span>
                      </div>
                    ))}
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
