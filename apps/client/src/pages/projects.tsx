import service from "@/service";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "api-interface";

const Projects = () => {
  const { data, status } = useQuery({
    queryKey: ["projects"],
    queryFn: () => service(endpoints.projects.getAll)({}),
  });
  if (status !== "success") return <div>Loading...</div>;
  console.log({ data });
  return (
    <div>
      {data.map((d) => (
        <div key={d.id}>
          <h1>{d.name}</h1>
        </div>
      ))}
    </div>
  );
};

export default Projects;
