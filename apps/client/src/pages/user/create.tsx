import service from "@/service";
import { handleReqError } from "@/utils/error.utils";
import { promiseToast } from "@/utils/toast.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "api-interface";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const createUserSchema = endpoints.users.create.bodySchema;

type ICreateUserData = z.infer<typeof createUserSchema>;

export default function CreateUser() {
  const { data: allPermissions } = useQuery({
    queryKey: ["user-permissions"],
    queryFn: () => service(endpoints.users.getAllPermissions)({}),
  });

  const handleCreateUser = async (data: ICreateUserData) => {
    try {
      await promiseToast(
        service(endpoints.users.create)({
          body: data,
        }),
        {
          loading: "Adding User...",
          success: "User Added",
        },
      );
    } catch (error) {
      handleReqError(error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ICreateUserData>({
    resolver: zodResolver(createUserSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "permissions",
  });

  console.log(fields);

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
          {allPermissions?.map((p) => (
            <div className="flex gap-2 items-center my-1 ml-2" key={p.id}>
              <input
                className="checkbox"
                type="checkbox"
                onChange={(e) => (e.target.checked ? append(p) : remove(p.id))}
              />
              <span>{p.permission}</span>
            </div>
          ))}
        </div>
        <button type="submit" className="btn">
          Add User
        </button>
      </form>
    </div>
  );
}
