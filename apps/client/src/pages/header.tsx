import { useRouter } from "next/router";
import { useState } from "react";

function Page() {
  const [text, setText] = useState("");

  const { asPath } = useRouter();
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  //const URL = `${origin}${asPath}`;
  const URL = `${origin}`;
  console.log(URL);
  //const { asPath } = useRouter();
  return (
    <div>
      <div className="flex items-center space-x-2">
        <img
          className="w-10 h-10 rounded-full"
          src="https://picsum.photos/seed/picsum/200"
          alt="Profile"
        />
        <textarea
          className="w-full h-32 p-2 text-lg bg-gray-100 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="What's happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Tweet
        </button>
      </div>
    </div>
  );
}

export default Page;
