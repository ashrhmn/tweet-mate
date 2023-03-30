import service from "@/service";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "api-interface";
import Link from "next/link";

const Users = () => {
  const { data, status } = useQuery({
    queryKey: ["users"],
    queryFn: () => service(endpoints.users.getAll)({}),
  });

  if (status !== "success") return <div>Loading...</div>;
  console.log({ data });

  return (
    <>
      <h1>User List</h1>
      <br />
      {data.map((user) => (
        <div key={user.id}>
          <p>
            <span>Username: </span>
            <Link href={`user/${user.id}`}>
              <span>{user.username}</span>
            </Link>
          </p>
          <p>
            Permissions:
            {user.permissions.map((permission) => (
              <> {permission}, </>
            ))}
          </p>
          <br />
          <br />
        </div>
      ))}
    </>
  );
};

export default Users;
