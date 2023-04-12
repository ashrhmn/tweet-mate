import service from "@/service";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "api-interface";

const useCurrentTwitterUser = () => {
  return useQuery({
    queryKey: ["twitter-user"],
    queryFn: () => service(endpoints.auth.currentTwitterUser)({}),
    cacheTime: 0,
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
};

export default useCurrentTwitterUser;
