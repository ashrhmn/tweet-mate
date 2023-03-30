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

  // const handlePermissionChange = async (selected: [], selectaction: {}) => {
  //   console.log(selected);
  //   setSelectedItems(selected);
  // };

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

  const { append, remove } = useFieldArray({
    control,
    name: "permissions",
  });

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

  // return (
  //   <div className="flex flex-col gap-4 items-center justify-center">
  //     <input
  //       className="text-xl p-2 rounded border-2 border-neutral-600"
  //       value={username}
  //       placeholder="Username"
  //       onChange={(e) => setUsername(e.target.value)}
  //     />
  //     <h1>Permissions: </h1>
  //     <div>
  //       <input
  //         type="checkbox"
  //         id="ADMIN_PERMISSION"
  //         onChange={(event) => {
  //           event.target.checked
  //             ? setPermissions((currentPermissions) => [
  //                 ...currentPermissions,
  //                 "ADMIN_PERMISSION",
  //               ])
  //             : setPermissions(
  //                 permissions.filter(
  //                   (permission) => permission !== "ADMIN_PERMISSION",
  //                 ),
  //               );
  //         }}
  //         checked={
  //           permissions.filter(
  //             (permission) => permission === "ADMIN_PERMISSION",
  //           ).length !== 0
  //             ? true
  //             : false
  //         }
  //       />
  //       <span>ADMIN_PERMISSION</span>
  //     </div>

  //     <div>
  //       <input
  //         type="checkbox"
  //         id="READ_USER"
  //         onChange={(event) => {
  //           event.target.checked
  //             ? setPermissions((currentPermissions) => [
  //                 ...currentPermissions,
  //                 "READ_USER",
  //               ])
  //             : setPermissions(
  //                 permissions.filter(
  //                   (permission) => permission !== "READ_USER",
  //                 ),
  //               );
  //         }}
  //         checked={
  //           permissions.filter((permission) => permission === "READ_USER")
  //             .length !== 0
  //             ? true
  //             : false
  //         }
  //       />
  //       <span>READ_USER</span>
  //     </div>

  //     <div>
  //       <input
  //         type="checkbox"
  //         id="CREATE_USER"
  //         onChange={(event) => {
  //           event.target.checked
  //             ? setPermissions((currentPermissions) => [
  //                 ...currentPermissions,
  //                 "CREATE_USER",
  //               ])
  //             : setPermissions(
  //                 permissions.filter(
  //                   (permission) => permission !== "CREATE_USER",
  //                 ),
  //               );
  //         }}
  //         checked={
  //           permissions.filter((permission) => permission === "CREATE_USER")
  //             .length !== 0
  //             ? true
  //             : false
  //         }
  //       />
  //       <span>CREATE_USER</span>
  //     </div>

  //     <div>
  //       <input
  //         type="checkbox"
  //         id="MANAGE_USER"
  //         onChange={(event) => {
  //           event.target.checked
  //             ? setPermissions((currentPermissions) => [
  //                 ...currentPermissions,
  //                 "MANAGE_USER",
  //               ])
  //             : setPermissions(
  //                 permissions.filter(
  //                   (permission) => permission !== "MANAGE_USER",
  //                 ),
  //               );
  //         }}
  //         checked={
  //           permissions.filter((permission) => permission === "MANAGE_USER")
  //             .length !== 0
  //             ? true
  //             : false
  //         }
  //       />
  //       <span>MANAGE_USER</span>
  //     </div>

  //     <div>
  //       <input
  //         type="checkbox"
  //         id="CREATE_PROJECT"
  //         onChange={(event) => {
  //           event.target.checked
  //             ? setPermissions((currentPermissions) => [
  //                 ...currentPermissions,
  //                 "CREATE_PROJECT",
  //               ])
  //             : setPermissions(
  //                 permissions.filter(
  //                   (permission) => permission !== "CREATE_PROJECT",
  //                 ),
  //               );
  //         }}
  //         checked={
  //           permissions.filter((permission) => permission === "CREATE_PROJECT")
  //             .length !== 0
  //             ? true
  //             : false
  //         }
  //       />
  //       <span>CREATE_PROJECT</span>
  //     </div>

  //     <div>
  //       <input
  //         type="checkbox"
  //         id="MANAGE_PROJECT"
  //         onChange={(event) => {
  //           event.target.checked
  //             ? setPermissions((currentPermissions) => [
  //                 ...currentPermissions,
  //                 "MANAGE_PROJECT",
  //               ])
  //             : setPermissions(
  //                 permissions.filter(
  //                   (permission) => permission !== "MANAGE_PROJECT",
  //                 ),
  //               );
  //         }}
  //         checked={
  //           permissions.filter((permission) => permission === "MANAGE_PROJECT")
  //             .length !== 0
  //             ? true
  //             : false
  //         }
  //       />
  //       <span>MANAGE_PROJECT</span>
  //     </div>
  //     {/* <input type="checkbox" id="checkbox2" onChange={(event) => { handleChange(event, "checkbox2") }} value={isSubscribed} checked={checkbox2 === "true"} /><span>Check 2</span> */}

  //     <input
  //       type="password"
  //       className="text-xl p-2 rounded border-2 border-neutral-600"
  //       value={password}
  //       placeholder="Password"
  //       onChange={(e) => setPassword(e.target.value)}
  //     />
  //     <input
  //       type="password"
  //       className="text-xl p-2 rounded border-2 border-neutral-600"
  //       value={confirmPassword}
  //       placeholder="Confirm Password"
  //       onChange={(e) => setConfirmPassword(e.target.value)}
  //     />

  //     <div>
  //       <button
  //         onClick={handleSubmit}
  //         className="bg-blue-500 p-2 rounded text-white"
  //       >
  //         Create User
  //       </button>
  //     </div>
  //   </div>
  // );
}
