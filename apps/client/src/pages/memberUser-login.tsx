// export const getServerSideProps: GetServerSideProps = async (context) =>
//   service(
//     endpoints.auth.currentDiscordUser,
//     context,
//   )({})
//     .then(() => ({
//       props: {},
//       redirect: { destination: "/", statusCode: 301 },
//     }))
//     .catch(() => ({ props: {} }));

import useCurrentDiscordUser from "@/hooks/useCurrentDiscordUser";
import service from "@/service";
import { handleReqError } from "@/utils/error.utils";
import { promiseToast } from "@/utils/toast.utils";
import { endpoints } from "api-interface";
import { useRouter } from "next/router";

export default function LoginMemberUser() {
  const { data: currentDiscordUser, refetch: refetchCurrentDiscordUser } =
    useCurrentDiscordUser();
  // const { data: currentTwitterUser } = useCurrentTwitterUser();
  const currentTwitterUser = {
    username: "EvaaanSarrwe",
  };

  let router = useRouter();
  if (currentDiscordUser && currentTwitterUser) {
    //router.push("/");
  }

  const revokeDiscord = async () => {
    await promiseToast(
      service(endpoints.auth.revokeDiscordUser)({}).then(
        () => refetchCurrentDiscordUser,
      ),
      {
        loading: "Discord Disconnecting ---",
        success: "Discord Disconnected",
      },
    ).catch(handleReqError);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white w-full max-w-md p-8 rounded-md shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Login
        </h1>
        <div className="flex justify-center items-center mb-6">
          <img
            src="/img/discord-icon.png"
            alt="Discord"
            className="w-10 h-10"
          />
          <span className="ml-4 mr-4">+</span>
          <img
            src="/img/twitter-icon.png"
            alt="Twitter"
            className="w-10 h-10"
          />
        </div>
        <p className="text-center text-gray-600 mb-6">
          Login with Discord & Twitter
        </p>

        {(currentDiscordUser && (
          <button className="relative bg-green-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-md w-full mb-4 transition duration-300 ease-in-out transform ">
            {`Discord Logged as ${currentDiscordUser?.username}`}
            <button
              onClick={revokeDiscord}
              className="absolute right-0 top-0 bottom-0 flex items-center px-2 bg-red-500 hover:bg-red-700 text-white rounded-tr-md rounded-br-md hover:scale-105"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.243 10L18 15.757 15.758 18l-5.757-5.757L4.242 18 2 15.758l5.757-5.757L2 4.242 4.242 2l5.757 5.757L15.757 2 18 4.242z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </button>
        )) || (
          <a
            href="/api/auth/discord"
            className="btn bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md w-full mb-4 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Login with Discord
          </a>
        )}
        {(currentTwitterUser && (
          <button className="relative bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md w-full mb-4 transition duration-300 ease-in-out transform ">
            {`Twitter Logged as ${currentTwitterUser?.username}`}
            <button className="absolute right-0 top-0 bottom-0 flex items-center px-2 bg-red-500 hover:bg-red-700 text-white rounded-tr-md rounded-br-md hover:scale-105">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.243 10L18 15.757 15.758 18l-5.757-5.757L4.242 18 2 15.758l5.757-5.757L2 4.242 4.242 2l5.757 5.757L15.757 2 18 4.242z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </button>
        )) || (
          <a
            href="/api/auth/twitter"
            className="btn bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-md w-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Login with Twitter
          </a>
        )}
      </div>
    </div>
  );
}
