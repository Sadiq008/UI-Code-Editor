import axios from "axios";
import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginProps {
  onAuthSuccess: (user: {
    name: string;
    email: string;
    profileImage?: string;
  }) => void;
}

const Login = ({ onAuthSuccess }: LoginProps) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const userData = {
          name: response.data.user.name,
          email: response.data.user.email,
          profileImage: response.data.user.profileImage || null,
          _id: response.data.user._id,
        };
        onAuthSuccess(userData);
        toast.success("Logged in successfully!");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      const errorMsg = axios.isAxiosError(err)
        ? err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed"
        : "An unexpected error occurred";

      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

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
        <div
          className="flex flex-col justify-center items-center bg-white w-full sm:w-[90%] md:w-[70%] lg:w-[30%] rounded-xl z-20 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="bg-blue-800 text-white text-center w-full pb-3 sm:pb-4 rounded-t-xl">
            <div className="flex justify-end mr-1.5 mt-2">
              <Link to={"/"}>
                <IoIosClose className="h-6 w-6 cursor-pointer border border-gray-300 rounded hover:border-gray-500 bg-white text-gray-500 hover:text-gray-700" />
              </Link>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold">Login</h1>
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
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="p-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="p-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 text-sm sm:text-base bg-green-600 text-white rounded hover:bg-green-700 transition-transform transform hover:scale-105 cursor-pointer ${
                  isLoading ? "opacity-70" : ""
                }`}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

              <p className="text-xs sm:text-sm text-gray-600 text-center">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-500 hover:underline">
                  Signup
                </Link>
              </p>
            </form>
          </main>
        </div>
      </div>
    </>
  );
};

export default Login;
