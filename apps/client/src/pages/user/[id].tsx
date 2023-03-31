import service from "@/service";
import { handleReqError } from "@/utils/error.utils";
import { promiseToast } from "@/utils/toast.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "api-interface";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateUserSchema = endpoints.users.update.bodySchema;

type IUpdateUserData = z.infer<typeof updateUserSchema>;

const getUserById = (id: string) =>
  service(endpoints.users.getUser)({ param: { id } });

const getAllPermissions = () => service(endpoints.users.getAllPermissions)({});

export default function UserUpdate() {
  const param = useRouter();
  const id = typeof param.query.id === "string" ? param.query.id : null;

  const {
    data: user,
    status: getUserStatus,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["getUser", id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
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
    <UserEditForm
      key={JSON.stringify(user)}
      user={user}
      allPermissions={allPermission}
      refetchUser={refetchUser}
    />
  );
}

const UserEditForm = ({
  user,
  allPermissions,
  refetchUser,
}: {
  user: Awaited<ReturnType<typeof getUserById>>;
  allPermissions: Awaited<ReturnType<typeof getAllPermissions>>;
  refetchUser: () => void;
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
      <form onSubmit={handleSubmit(handleUpdateUser)}>
        <div className="form-control w-full max-w-sm">
          <label className="label">Username</label>
          <input
            className="input input-bordered"
            type="text"
            {...register("username")}
          />
          <p className="text-error">{errors.username?.message}</p>
        </div>
        <div className="form-control w-full max-w-sm">
          <label className="label">Password</label>
          <input
            className="input input-bordered"
            type="password"
            {...register("password")}
          />
          <p className="text-error">{errors.password?.message}</p>
        </div>
        <div className="form-control w-full max-w-sm">
          <label className="label">Confirm Password</label>
          <input
            className="input input-bordered"
            type="password"
            {...register("confirmPassword")}
          />
          <p className="text-error">{errors.confirmPassword?.message}</p>
        </div>
        <div className="form-control w-full max-w-sm">
          <label className="label">Permissions</label>
          {allPermissions.map((p) => (
            <div className="flex gap-2 items-center my-1 ml-2" key={p}>
              <input
                className="input input-bordered"
                type="checkbox"
                defaultChecked={getValues("permissions").includes(p)}
                onChange={(e) =>
                  e.target.checked
                    ? setValue("permissions", [...getValues("permissions"), p])
                    : setValue(
                        "permissions",
                        getValues("permissions").filter((perm) => perm !== p),
                      )
                }
              />
              <span>{p}</span>
            </div>
          ))}
        </div>
        <button type="submit" className="btn">
          Update User
        </button>
      </form>
    </div>
  );
};
