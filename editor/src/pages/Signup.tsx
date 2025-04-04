import { useState, useRef } from "react";
import axios from "axios";
import { IoIosClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileLogo from "../assets/def-profile.svg";

interface SignupProps {
  onAuthSuccess: (user: {
    name: string;
    email: string;
    profileImage?: string;
  }) => void;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  profileImage?: File | null;
}

const Signup = ({ onAuthSuccess }: SignupProps) => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    profileImage: null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(ProfileLogo);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, profileImage: file }));

      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("email", formData.email);
    formPayload.append("password", formData.password);
    if (formData.profileImage) {
      formPayload.append("profileImage", formData.profileImage);
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/signup",
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        const userData = {
          name: response.data.user.name,
          email: response.data.user.email,
          profileImage: response.data.user.profileImage || null,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        onAuthSuccess(userData);
        toast.success("Account created successfully!", {
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
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      const errorMsg = axios.isAxiosError(err)
        ? err.response?.data?.message || "Signup failed"
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
          className="flex flex-col justify-center items-center bg-white w-full sm:w-[90%] md:w-[70%] lg:w-[30%] rounded-xl z-20 relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="bg-blue-800 text-white text-center w-full pb-2 sm:pb-4 rounded-t-xl">
            <div className="flex justify-end mr-1.5 mt-2">
              <Link to={"/"}>
                <IoIosClose className="h-6 w-6 cursor-pointer border border-gray-300 rounded hover:border-gray-500 bg-white text-gray-500 hover:text-gray-700" />
              </Link>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold pb-1 sm:pb-2">
              Signup
            </h1>
          </header>

          <main className="flex flex-col items-center justify-center w-full p-2 sm:p-4">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full space-y-3 sm:space-y-4 px-3 sm:px-6 py-4"
            >
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div className="flex flex-col items-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mb-2"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 mb-2"></div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 cursor-pointer mb-2 sm:mb-4"
                >
                  {previewImage
                    ? "Change Image"
                    : "Add Profile Image (Optional)"}
                </button>
              </div>

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="p-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

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
                {isLoading ? "Signing up..." : "Signup"}
              </button>

              <p className="text-xs sm:text-sm text-gray-600 text-center mt-1 sm:mt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </main>
        </div>
      </div>
    </>
  );
};

export default Signup;
