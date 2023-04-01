import service from "@/service";
import { handleReqError } from "@/utils/error.utils";
import { promiseToast } from "@/utils/toast.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "api-interface";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateUserSchema = endpoints.users.update.bodySchema;

type IUpdateUserData = z.infer<typeof updateUserSchema>;

const getUserById = (id: string) =>
  service(endpoints.users.getUser)({ param: { id } });

const getAllPermissions = () => service(endpoints.users.getAllPermissions)({});

export default function Update({
  userID,
  handleFormClose,
  refetchUsers,
}: {
  userID: string;
  handleFormClose: () => void;
  refetchUsers: () => void;
}) {
  const {
    data: user,
    status: getUserStatus,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["getUser", userID],
    queryFn: () => getUserById(userID!),
    enabled: !!userID,
  });

  const { data: allPermission, status: allPermissionFetchStatus } = useQuery({
    queryKey: ["user-permission"],
    queryFn: getAllPermissions,
  });

  if (getUserStatus === "loading") return <div>Loading...</div>;
  if (allPermissionFetchStatus === "loading") return <div>Loading...</div>;
  if (getUserStatus === "error") return <div>User not found</div>;
  if (allPermissionFetchStatus === "error") return <div>User not found</div>;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <br />
      <div className="flex items-end justify-center min-h-screen text-center sm:block ">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={handleFormClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div
          className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full "
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <UserEditForm
            key={JSON.stringify(user)}
            user={user}
            allPermissions={allPermission}
            refetchUser={refetchUser}
            refetchUsers={refetchUsers}
          />
        </div>
      </div>
    </div>
  );
}

const UserEditForm = ({
  user,
  allPermissions,
  refetchUser,
  refetchUsers,
}: {
  user: Awaited<ReturnType<typeof getUserById>>;
  allPermissions: Awaited<ReturnType<typeof getAllPermissions>>;
  refetchUser: () => void;
  refetchUsers: () => void;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<IUpdateUserData>({
    defaultValues: {
      username: user.username,
      permissions: user.permissions,
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(updateUserSchema),
  });

  const handleUpdateUser = async (data: IUpdateUserData) => {
    await promiseToast(
      service(endpoints.users.update)({
        body: data,
        param: { id: user.id },
      })
        .then(refetchUser)
        .then(refetchUsers)
        .catch(handleReqError),
      {
        loading: "Updating User....",
        success: "User Updated",
      },
    );
  };
  // console.log(JSON.stringify(watch(), null, 2));
  console.log(JSON.stringify(getValues("permissions"), null, 2));
  // console.log(JSON.stringify(user, null, 2));
  return (
    <div>
      <div className="relative sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-0 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="h-14 w-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex flex-shrink-0 justify-center items-center text-white text-2xl font-bold">
                U
              </div>
              <div className="block pl-2 font-semibold text-2xl self-start text-gray-700">
                <h2 className="leading-relaxed">Update User Info</h2>
                <p className="text-sm text-gray-500 font-normal leading-relaxed">
                  Please fill in your information to update a user.
                </p>
              </div>
            </div>
            <form className="mt-10" onSubmit={handleSubmit(handleUpdateUser)}>
              <div className="mb-6">
                <label
                  htmlFor="username"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  {...register("username")}
                />
                <p className="text-error">{errors.username?.message}</p>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  {...register("password")}
                />
                <p className="text-error">{errors.password?.message}</p>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  {...register("confirmPassword")}
                />
                <p className="text-error">{errors.confirmPassword?.message}</p>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Permissions
                </label>

                {allPermissions.map((p) => (
                  <div className="flex items-center ">
                    <input
                      type="checkbox"
                      id="permissions"
                      name="permissions"
                      className="h-4 w-4 rounded-full border-gray-300 focus:ring-pink-500 text-pink-500"
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
                    <label
                      htmlFor="permissions"
                      className="ml-2 block text-sm text-gray-700 font-semibold"
                    >
                      {p}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-4 py-3 rounded-lg w-full tracking-wider hover:bg-pink-600"
                >
                  Update User
                </button>
              </div>
              {/* <p className="text-sm text-gray-500 font-normal">
                          Already have an account?{" "}
                          <a
                            href="#"
                            className="text-pink-500 hover:text-pink-600"
                          >
                            Sign in
                          </a>
                        </p> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
