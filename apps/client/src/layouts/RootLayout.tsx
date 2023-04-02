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
      <nav className="text-xl flex w-full justify-end items-center gap-4 p-4">
        {!!user && (
          <>
            <Link href={`/`}>Dashboard</Link>
            {hasPermissions("READ_USER") && <Link href={`/users`}>Users</Link>}
          </>
        )}
        {(!user || currentUserStatus === "error") && (
          <Link href={`/login`}>Login</Link>
        )}
      </nav>
      <main>{children}</main>
      <Toaster position="bottom-right" />
    </>
  );
};

export default RootLayout;
