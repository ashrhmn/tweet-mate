import FullScreenSpinner from "@/components/common/FullScreenSpinner";
import useCurrentUser from "@/hooks/useCurrentUser";
import Link from "next/link";
import { ReactNode, useCallback } from "react";
import { Toaster } from "react-hot-toast";

const RootLayout = ({ children }: { children: ReactNode }) => {
  const { user, currentUserStatus } = useCurrentUser();
  const hasPermissions = useCallback(
    (...permissions: Exclude<typeof user, undefined>["permissions"]) => {
      if (!user) return false;
      if (user.permissions.includes("ADMIN_PERMISSION")) return true;
      return permissions.some((p) => user.permissions.includes(p));
    },
    [user],
  );
  if (currentUserStatus === "loading") return <FullScreenSpinner />;
  return (
    <>
      <header className="bg-gradient-to-r from-indigo-500 to-purple-500 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <img className="h-8 w-auto" alt="Logo" />
              </Link>
              <div className="hidden ml-6 sm:flex sm:space-x-8">
                {!!user && (
                  <>
                    <Link
                      href={`/`}
                      className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>

                    {hasPermissions("MANAGE_PROJECT") && (
                      <Link
                        href={`/projects`}
                        className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Projects
                      </Link>
                    )}

                    {hasPermissions("READ_USER") && (
                      <Link
                        href={`/users`}
                        className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Users
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center">
              {(!user || currentUserStatus === "error") && (
                <Link href={`/login`}>Login</Link>
              )}

              {(!user || currentUserStatus !== "error") && (
                <>
                  <button
                    type="button"
                    className="text-gray-200 hover:text-white focus:outline-none focus:text-white"
                  >
                    <span className="sr-only">Open menu</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      ></path>
                    </svg>
                  </button>
                  <div className="ml-4 relative">
                    <button
                      type="button"
                      className="text-gray-200 hover:text-white focus:outline-none focus:text-white"
                    >
                      <span className="sr-only">View notifications</span>
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="bell"
                        className=" w-6 text-white"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path
                          fill="currentColor"
                          d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z"
                        ></path>
                      </svg>
                    </button>
                    {/* <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                  <Link
                    href="/notifications"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    View all
                  </Link>
                </div> */}
                  </div>
                  <div className="ml-3 relative">
                    <div>
                      <button
                        type="button"
                        className="flex text-sm rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out"
                        id="user-menu"
                        aria-expanded="false"
                        aria-haspopup="true"
                      >
                        <span className="sr-only">Open user menu</span>
                        <img className="h-8 w-8 rounded-full" alt="Profile" />
                      </button>
                    </div>
                    {/* <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Logout
                  </a>
                </div> */}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Toaster position="bottom-right" />
    </>
  );
};

export default RootLayout;
