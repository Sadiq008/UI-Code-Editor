//? importing User Interface from App.tsx ?//
import { User } from "../App";

//? Importing Link from react-router-dom ?//
import { Link } from "react-router-dom";

//? Importing React-icons ?//
import { IoIosClose } from "react-icons/io";

//? Importing Default Profile Image ?//
import DefaultProfileLogo from "../assets/def-profile.svg";

//? Account Props Interface?//
interface AccountProps {
  user: User | null;
  handleLogout: () => void;
}

const Account = ({ user, handleLogout }: AccountProps) => {
  const UserDetails = user || {
    name: "",
    email: "",
    profileImage: undefined,
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl relative p-6 mx-4">
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <Link to="/">
            <button className="p-1 rounded-full hover:bg-gray-100">
              <IoIosClose className="h-6 w-6 cursor-pointer border border-gray-300 rounded hover:border-gray-500 bg-white text-gray-500 hover:text-gray-700" />
            </button>
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">My Account</h1>

        {user ? (
          <div className="w-full flex flex-col items-center">
            <div className="mb-4">
              {UserDetails.profileImage ? (
                <img
                  src={UserDetails.profileImage}
                  alt={UserDetails.name || "User"}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-blue-500">
                  <img
                    src={DefaultProfileLogo}
                    alt="Default Profile"
                    className=" object-cover"
                  />
                </div>
              )}
            </div>

            <div className="w-full space-y-3 mb-6">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Name:</span>
                <span>{UserDetails.name || "Not available"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Email:</span>
                <span>{UserDetails.email || "Not available"}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">No user information available.</p>
            <p>
              Please{" "}
              <Link
                to={"/login"}
                className="cursor-pointer text-sky-600 hover:underline hover:text-sky-500"
              >
                log in
              </Link>{" "}
              to view your account details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
