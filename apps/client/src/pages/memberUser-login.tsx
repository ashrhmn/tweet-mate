import service from "@/service";
import { endpoints } from "api-interface";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) =>
  service(
    endpoints.auth.currentDiscordUser,
    context,
  )({})
    .then(() => ({
      props: {},
      redirect: { destination: "/", statusCode: 301 },
    }))
    .catch(() => ({ props: {} }));

export default function LoginMemberUser() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white w-full max-w-md p-8 rounded-md shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Login
        </h1>
        <div className="flex justify-center items-center mb-6">
          <img
            src="/discord-icon.svg"
            alt="Discord"
            className="w-10 h-10 mr-4"
          />
          <img src="/twitter-icon.svg" alt="Twitter" className="w-10 h-10" />
        </div>
        <p className="text-center text-gray-600 mb-6">
          Login with either Discord or Twitter
        </p>
        <a
          href="/api/auth/discord"
          className="btn bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md w-full mb-4 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Login with Discord
        </a>
        <a
          href="/api/auth/twitter"
          className="btn bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-md w-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Login with Twitter
        </a>
      </div>
    </div>
  );
}
