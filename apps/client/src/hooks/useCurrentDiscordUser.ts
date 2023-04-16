import service from "@/service";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "api-interface";

const useCurrentDiscordUser = () => {
  return useQuery({
    queryKey: ["discord-user"],
    queryFn: () => service(endpoints.auth.currentDiscordUser)({}),
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

export default useCurrentDiscordUser;
