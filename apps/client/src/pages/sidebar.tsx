import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const Sidebar = ({ isOpen, onClose }: Props) => {
  return (
    <div
      className={`fixed inset-0 overflow-hidden transition-all ease-in-out duration-300 z-30 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="h-full bg-opacity-50 backdrop-filter backdrop-blur-md overflow-y-auto flex items-center justify-center">
            <div className="h-full p-8 bg-white rounded-md shadow-lg">
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
                    Sign Up
                  </h2>
                  <form className="space-y-6 border-2 border-gray-200 rounded-md p-4">
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 border-gray-200"
                        placeholder="Username"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 border-gray-200"
                        placeholder="Password"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 border-gray-200"
                        placeholder="Confirm Password"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        Permissions
                      </label>
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-green-500"
                        />
                        <span className="ml-2 text-gray-700">Permission 1</span>
                      </div>{" "}
                      <div className="flex justify-center">
                        <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Sign Up
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <button onClick={handleSidebarToggle}>Open Sidebar</button>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <p> kire vao njdjnsjdnsdf sdf</p>
      <h1>kshkdjnfksdf</h1>
      <h2>shdihsduhcbjsbdcbusdc</h2>
    </div>
  );
};

export default App;
