import service from "@/service";
import { promiseToast } from "@/utils/toast.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "api-interface";
import { useRouter } from "next/router";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const createUserSchema = endpoints.users.update.bodySchema;

type ICreateUserData = z.infer<typeof createUserSchema>;

export default function UserUpdate() {
  const param = useRouter();
  const id = typeof param.query.id === "string" ? param.query.id : null;

  const { data: user, status: getUserStatus } = useQuery({
    queryKey: ["getUser"],
    queryFn: () =>
      id ? service(endpoints.users.getUser)({ param: { id } }) : null,
    enabled: id ? true : false,
  });

  const { data: allPermission } = useQuery({
    queryKey: ["user-permission"],
    queryFn: () => service(endpoints.users.getAllPermissions)({}),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm<ICreateUserData>({
    defaultValues: {
      username: "evan",
      permissions: allPermission,
    },
    resolver: zodResolver(createUserSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "permissions",
  });

  const handleCreateUser = async (data: ICreateUserData) => {
    try {
      if (id) {
        await promiseToast(
          service(endpoints.users.update)({
            body: data,
            param: { id },
          }),
          {
            loading: "Updating User....",
            success: "User Updated",
          },
        );
      }
    } catch {}
  };

  // allPermission?.map((p) =>
  //   user?.permissions.map((up) =>
  //     p.permission === up ? userPermissions?.push(p) : null,
  //   ),
  // );
  // console.log(userPermissions);
  // console.log(fields);
  console.log(watch());

  if (getUserStatus === "loading") return <div>Loading...</div>;
  else if (getUserStatus === "error") return <div>User not found</div>;

  return (
    <div>
      <form onSubmit={handleSubmit(handleCreateUser)}>
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
          {allPermission?.map((p) => (
            <div className="flex gap-2 items-center my-1 ml-2" key={p.id}>
              <input
                className="input input-bordered"
                type="checkbox"
                onChange={(e) => (e.target.checked ? append(p) : remove(p.id))}
              />
              <span>{p.permission}</span>
            </div>
          ))}

          <p className="text-error">{errors.confirmPassword?.message}</p>
        </div>
        <button type="submit" className="btn">
          Update User
        </button>
      </form>
    </div>
  );
}
