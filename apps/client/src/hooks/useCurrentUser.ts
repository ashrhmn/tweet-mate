import service from "@/service";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "api-interface";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useCurrentUser = () => {
  const router = useRouter();
  const { data, error, status, refetch } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => service(endpoints.auth.currentUser)({}),
  });
  useEffect(() => {
    refetch();
  }, [refetch, router.asPath]);
  return {
    user: data,
    error,
    currentUserStatus: status,
  };
};

export default useCurrentUser;
