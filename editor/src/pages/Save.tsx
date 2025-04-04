import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface SaveFormData {
  title: string;
  description: string;
}

interface SaveProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
}

const Save = ({ htmlCode, cssCode, jsCode }: SaveProps) => {
  const [formData, setFormData] = useState<SaveFormData>({
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Verify localStorage user exists
      const user = localStorage.getItem("user");
      if (!user) {
        throw new Error("Session expired - Please log in again");
      }

      const response = await axios.post(
        "http://localhost:3001/save",
        {
          ...formData,
          htmlCode,
          cssCode,
          jsCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Crucial for sessions
        }
      );
      if (response.status === 200) {
        toast.success("Code saved successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
        });
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      let errorMsg = "Failed to save code";
      if (axios.isAxiosError(err)) {
        errorMsg = err.response?.data?.message || err.message;
        console.error("Backend response:", err.response?.data);
      }
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />

      <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-md flex justify-center items-center z-10 p-2 sm:p-0">
        <div className="flex flex-col justify-center items-center bg-white w-full sm:w-[90%] md:w-[70%] lg:w-[30%] rounded-xl z-20 relative max-h-[90vh] overflow-y-auto">
          <header className="bg-blue-800 text-white text-center w-full pb-3 sm:pb-4 rounded-t-xl">
            <div className="flex justify-end mr-1.5 mt-2">
              <Link to={"/"}>
                <IoIosClose className="h-6 w-6 cursor-pointer border border-gray-300 rounded hover:border-gray-500 bg-white text-gray-500 hover:text-gray-700" />
              </Link>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold">Save Code</h1>
          </header>

          <main className="flex flex-col items-center justify-center w-full p-4 sm:p-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full space-y-3 sm:space-y-4"
            >
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="p-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                name="description"
                placeholder="Description (optional)"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="p-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 text-sm sm:text-base bg-green-600 text-white rounded hover:bg-green-700 transition-transform transform hover:scale-105 cursor-pointer ${
                  isLoading ? "opacity-70" : ""
                }`}
              >
                {isLoading ? "Saving..." : "Save Code"}
              </button>
            </form>
          </main>
        </div>
      </div>
    </>
  );
};

export default Save;
