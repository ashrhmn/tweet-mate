import ErrorView from "@/components/common/ErrorView";
import Create from "@/components/users/CreateUserForm";
import Update from "@/components/users/UpdateUserForm";
import service from "@/service";
import { handleReqError } from "@/utils/error.utils";
import { promiseToast } from "@/utils/toast.utils";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "api-interface";
import Link from "next/link";
import { useMemo, useState } from "react";

const Users = () => {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userID, setUserID] = useState("");
  const [query, setQuery] = useState("");

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditClick = (id: string) => {
    setIsEditFormOpen(true);
    setUserID(id);
  };

  const handleFormClose = () => {
    setIsEditFormOpen(false);
  };

  const {
    data: getUsers,
    status: getUsersStatus,
    refetch: refetchUsers,
    error: getUsersError,
  } = useQuery({
    queryKey: ["getUsers"],
    queryFn: () => service(endpoints.users.getAll)({}),
  });

  const filteredUsers = useMemo(() => {
    if (!getUsers) return [];
    if (!query) return getUsers;
    return getUsers.filter((user) =>
      user.username.toLowerCase().includes(query),
    );
  }, [getUsers, query]);

  if (getUsersStatus === "loading") return <div>Loading...</div>;
  if (getUsersStatus === "error") return <ErrorView error={getUsersError} />;

  const handleDeleteUser = async (id: string) => {
    await promiseToast(
      service(endpoints.users.delete)({
        param: { id },
      }).then(() => refetchUsers),
      {
        loading: "Deleting User....",
        success: "User Deleted",
      },
    ).catch(handleReqError);
  };

  return (
    <>
      <div className="w-full">
        <button
          className="relative inline-block py-2 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
          onClick={handleSidebarToggle}
        >
          <span className="relative z-10">Create User</span>
          <span className="absolute top-0 left-0 w-full h-full bg-white opacity-10 rounded-lg filter blur-md -z-1 animate-pulse"></span>
        </button>
        <Create
          key="create"
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          refetchUsers={refetchUsers}
        />
        <br />
        <br />
        <div className="w-full overflow-hidden rounded-lg shadow-lg">
          <div className="w-full overflow-x-auto">
            <div className="flex justify-between items-center bg-gradient-to-r from-purple-900 to-purple-700 px-4 py-3">
              <h1 className="text-white font-bold text-lg">Users</h1>
              <input
                type="text"
                placeholder="Search"
                className="px-3 py-1 text-gray-700 border-2 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-purple-600 
              focus:border-transparent"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <table className="w-full whitespace-no-wrap table-auto">
              <thead>
                <tr
                  className="text-xs font-semibold tracking-wide text-left 
                text-white uppercase border-b bg-gradient-to-r from-purple-900 to-purple-700"
                >
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Permissions</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-100">
                {filteredUsers.map((user) => (
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
                          key={permission}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {permission}
                        </span>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold border whitespace-nowrap">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleEditClick(user.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                        onClick={() => {
                          if (window.confirm("Want to delete the user?")) {
                            handleDeleteUser(user.id);
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
          <Update
            key={userID}
            userID={userID}
            handleFormClose={handleFormClose}
            refetchUsers={refetchUsers}
          />
        )}
      </div>
      <br />
      <br />
    </>
  );
};

export default Users;
