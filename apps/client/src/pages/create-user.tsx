import service from "@/service";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "api-interface";
import { useState } from "react";

export default function CreateUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // const handlePermissionChange = async (selected: [], selectaction: {}) => {
  //   console.log(selected);
  //   setSelectedItems(selected);
  // };

  const handleSubmit = () => {
    // selectedItems.map((item) => permissions.push(item.value));
    // console.log(permissions);
    const { data, status, error } = useQuery({
      queryKey: ["userCreate"],
      queryFn: () =>
        service(endpoints.users.create)({
          body: { username, permissions, password, confirmPassword },
        }),
    });

    console.log(status, error);
    if (status !== "success") return <div>Loading...</div>;
    console.log({ data });
  };

  console.log(permissions);

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <input
        className="text-xl p-2 rounded border-2 border-neutral-600"
        value={username}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <h1>Permissions: </h1>
      <div>
        <input
          type="checkbox"
          id="ADMIN_PERMISSION"
          onChange={(event) => {
            event.target.checked
              ? setPermissions((currentPermissions) => [
                  ...currentPermissions,
                  "ADMIN_PERMISSION",
                ])
              : setPermissions(
                  permissions.filter(
                    (permission) => permission !== "ADMIN_PERMISSION",
                  ),
                );
          }}
          checked={
            permissions.filter(
              (permission) => permission === "ADMIN_PERMISSION",
            ).length !== 0
              ? true
              : false
          }
        />
        <span>ADMIN_PERMISSION</span>
      </div>

      <div>
        <input
          type="checkbox"
          id="READ_USER"
          onChange={(event) => {
            event.target.checked
              ? setPermissions((currentPermissions) => [
                  ...currentPermissions,
                  "READ_USER",
                ])
              : setPermissions(
                  permissions.filter(
                    (permission) => permission !== "READ_USER",
                  ),
                );
          }}
          checked={
            permissions.filter((permission) => permission === "READ_USER")
              .length !== 0
              ? true
              : false
          }
        />
        <span>READ_USER</span>
      </div>

      <div>
        <input
          type="checkbox"
          id="CREATE_USER"
          onChange={(event) => {
            event.target.checked
              ? setPermissions((currentPermissions) => [
                  ...currentPermissions,
                  "CREATE_USER",
                ])
              : setPermissions(
                  permissions.filter(
                    (permission) => permission !== "CREATE_USER",
                  ),
                );
          }}
          checked={
            permissions.filter((permission) => permission === "CREATE_USER")
              .length !== 0
              ? true
              : false
          }
        />
        <span>CREATE_USER</span>
      </div>

      <div>
        <input
          type="checkbox"
          id="MANAGE_USER"
          onChange={(event) => {
            event.target.checked
              ? setPermissions((currentPermissions) => [
                  ...currentPermissions,
                  "MANAGE_USER",
                ])
              : setPermissions(
                  permissions.filter(
                    (permission) => permission !== "MANAGE_USER",
                  ),
                );
          }}
          checked={
            permissions.filter((permission) => permission === "MANAGE_USER")
              .length !== 0
              ? true
              : false
          }
        />
        <span>MANAGE_USER</span>
      </div>

      <div>
        <input
          type="checkbox"
          id="CREATE_PROJECT"
          onChange={(event) => {
            event.target.checked
              ? setPermissions((currentPermissions) => [
                  ...currentPermissions,
                  "CREATE_PROJECT",
                ])
              : setPermissions(
                  permissions.filter(
                    (permission) => permission !== "CREATE_PROJECT",
                  ),
                );
          }}
          checked={
            permissions.filter((permission) => permission === "CREATE_PROJECT")
              .length !== 0
              ? true
              : false
          }
        />
        <span>CREATE_PROJECT</span>
      </div>

      <div>
        <input
          type="checkbox"
          id="MANAGE_PROJECT"
          onChange={(event) => {
            event.target.checked
              ? setPermissions((currentPermissions) => [
                  ...currentPermissions,
                  "MANAGE_PROJECT",
                ])
              : setPermissions(
                  permissions.filter(
                    (permission) => permission !== "MANAGE_PROJECT",
                  ),
                );
          }}
          checked={
            permissions.filter((permission) => permission === "MANAGE_PROJECT")
              .length !== 0
              ? true
              : false
          }
        />
        <span>MANAGE_PROJECT</span>
      </div>
      {/* <input type="checkbox" id="checkbox2" onChange={(event) => { handleChange(event, "checkbox2") }} value={isSubscribed} checked={checkbox2 === "true"} /><span>Check 2</span> */}

      <input
        type="password"
        className="text-xl p-2 rounded border-2 border-neutral-600"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        className="text-xl p-2 rounded border-2 border-neutral-600"
        value={confirmPassword}
        placeholder="Confirm Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 p-2 rounded text-white"
        >
          Create User
        </button>
      </div>
    </div>
  );
}
