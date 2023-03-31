import service from "@/service";
import { promiseToast } from "@/utils/toast.utils";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "api-interface";
import Link from "next/link";
import { useState } from "react";

const Users = () => {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [query, setQuery] = useState("");
  const handleEditClick = () => {
    setIsEditFormOpen(true);
  };

  const handleFormClose = () => {
    setIsEditFormOpen(false);
  };

  const Search = (data) => {
    return data.filter((item) =>
      item.username.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const {
    data: getUsers,
    status: getUsersStatus,
    refetch,
  } = useQuery({
    queryKey: ["getUsers"],
    queryFn: () => service(endpoints.users.getAll)({}),
  });

  if (getUsersStatus === "loading") return <div>Loading...</div>;
  else if (getUsersStatus === "error") return <div>Users not found</div>;

  const deleteDevice = async (id: string) => {
    await promiseToast(service(endpoints.users.delete)({ param: { id } }), {
      loading: "Deleting User....",
      success: "User Deleted",
    }).then(() => refetch);
  };

  return (
    <>
      <div className="w-full">
        <button
          className="
    relative inline-block py-2 px-4 rounded-lg text-white font-semibold 
    bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-80 
    focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50
  "
        >
          <span className="relative z-10">Create User</span>
          <span
            className="
      absolute top-0 left-0 w-full h-full bg-white opacity-10 rounded-lg 
      filter blur-md -z-1 animate-pulse"
          ></span>
        </button>
        <br />
        <br />
        <div className="w-full overflow-hidden rounded-lg shadow-lg">
          <div className="w-full overflow-x-auto">
            <div className="flex justify-between items-center bg-gradient-to-r from-purple-900 to-purple-700 px-4 py-3">
              <h1 className="text-white font-bold text-lg">Users</h1>
              <input
                type="text"
                placeholder="Search"
                className="
              px-3 py-1 text-gray-700 border-2 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-purple-600 
              focus:border-transparent
            "
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <table className="w-full whitespace-no-wrap table-auto">
              <thead>
                <tr
                  className="
                text-xs font-semibold tracking-wide text-left 
                text-white uppercase border-b bg-gradient-to-r from-purple-900 to-purple-700
              "
                >
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Permissions</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-100">
                {Search(getUsers).map((user) => (
                  <tr key={user.id} className="text-gray-600">
                    <td className="px-4 py-3 border">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="text-sm font-medium">{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ms font-semibold border">
                      <Link href={`user/${user.id}`}>{user.username}</Link>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold border">
                      {user.permissions.map((permission) => (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full 
                            text-xs font-medium bg-green-100 text-green-800
                          "
                        >
                          {permission}
                        </span>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold border">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleEditClick}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                        onClick={() => {
                          if (window.confirm("Want to delete the user?")) {
                            deleteDevice(user.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isEditFormOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
                onClick={handleFormClose}
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              ></span>

              <div
                className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Edit Form
                    </h3>
                    <div className="mt-2">
                      <form>
                        <div className="mt-4">
                          <label></label>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <br />
      <br />
    </>
  );
};

export default Users;
