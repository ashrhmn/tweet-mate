import service from "@/service";
import { handleReqError } from "@/utils/error.utils";
import { promiseToast } from "@/utils/toast.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { endpoints } from "api-interface";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createProjectSchema = endpoints.projects.create.bodySchema;

type ICreateProjectData = z.infer<typeof createProjectSchema>;

export default function Create() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ICreateProjectData>({
    resolver: zodResolver(createProjectSchema),
  });

  const handleCreateUser = async (data: ICreateProjectData) => {
    try {
      await promiseToast(
        service(endpoints.projects.create)({
          body: data,
        }),
        {
          loading: "Adding Project...",
          success: "Project Created",
        },
      );
    } catch (error) {
      handleReqError(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleCreateUser)}>
        <div className="form-control w-full max-w-sm">
          <label className="label">Name</label>
          <input
            className="input input-bordered"
            type="text"
            {...register("name")}
          />
          <p className="text-error">{errors.name?.message}</p>
        </div>
        <div className="form-control w-full max-w-sm">
          <label className="label">Url (Web Link)</label>
          <input
            className="input input-bordered"
            type="url"
            {...register("url")}
          />
          <p className="text-error">{errors.url?.message}</p>
        </div>
        <div className="form-control w-full max-w-sm">
          <label className="label">Description</label>
          <textarea
            className="input input-bordered"
            {...register("description")}
          />
          <p className="text-error">{errors.description?.message}</p>
        </div>
        <br />
        <div className="form-control w-full max-w-sm">
          <button type="submit" className="btn">
            Add Project
          </button>
        </div>
      </form>
    </div>
  );
}
