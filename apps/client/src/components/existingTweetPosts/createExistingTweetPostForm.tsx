import service from "@/service";
import { handleReqError } from "@/utils/error.utils";
import { promiseToast } from "@/utils/toast.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { endpoints } from "api-interface";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createReTweetSchema =
  endpoints.existingTweetPosts.createReTweet.bodySchema;

type ICreateReTweetData = z.infer<typeof createReTweetSchema>;

const createLikeOfTweetSchema =
  endpoints.existingTweetPosts.createLikeOfTweet.bodySchema;

type ICreateLikeOfTweetData = z.infer<typeof createLikeOfTweetSchema>;

export default function Create({
  isOpen,
  onClose,
  projectId,
  isRetweet,
  refetchProject,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  isRetweet: boolean;
  refetchProject: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateReTweetData>({
    resolver: zodResolver(createReTweetSchema),
  });

  const handleCreateReTweet = async (data: ICreateReTweetData) => {
    if (isRetweet) {
      try {
        await promiseToast(
          service(endpoints.existingTweetPosts.createReTweet)({
            body: data,
            param: { projectId },
          }).then(refetchProject),
          {
            loading: "Adding ReTweet Post...",
            success: "ReTweet Post Added",
          },
        ).catch(handleReqError);
      } catch (error) {
        handleReqError(error);
      }
    } else {
      try {
        await promiseToast(
          service(endpoints.existingTweetPosts.createLikeOfTweet)({
            body: data,
            param: { projectId },
          }).then(refetchProject),
          {
            loading: "Adding Like Of Tweet...",
            success: "Like Of Tweet Added",
          },
        ).catch(handleReqError);
      } catch (error) {
        handleReqError(error);
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 overflow-hidden transition-all ease-in-out duration-300 z-30 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="h-full p-8  bg-white bg-opacity-50 backdrop-filter backdrop-blur-md overflow-y-auto flex items-center justify-center">
            <button
              className="absolute top-0 left-0 m-4 p-2 rounded-full text-gray-800 hover:bg-gray-300"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="h-screen flex items-center">
              <div>
                <h2 className="text-lg font-medium mb-4 text-gray-800">
                  {isRetweet ? "Add New ReTweet" : "Add Like of Tweet"}
                </h2>
                <form
                  className="bg-white bg-opacity-70 space-y-6 border-2 border-gray-200 rounded-md p-4"
                  onSubmit={handleSubmit(handleCreateReTweet)}
                >
                  {isRetweet && (
                    <div>
                      <div className="pb-2">
                        <label className="block text-gray-700 font-bold mb-2">
                          Tweet Url
                        </label>
                        <input
                          type="url"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 border-gray-200"
                          placeholder="url"
                          {...register("tweetUrl")}
                        />
                        <p className="text-error">{errors.tweetUrl?.message}</p>
                      </div>

                      <div>
                        <div className="flex justify-center">
                          <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                            Add ReTweet
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {isRetweet || (
                    <div>
                      <div className="pb-2">
                        <label className="block text-gray-700 font-bold mb-2">
                          Tweet Url
                        </label>
                        <input
                          type="url"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 border-gray-200"
                          placeholder="url"
                          {...register("tweetUrl")}
                        />
                        <p className="text-error">{errors.tweetUrl?.message}</p>
                      </div>

                      <div>
                        <div className="flex justify-center">
                          <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                            Add Like Of Tweet
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
