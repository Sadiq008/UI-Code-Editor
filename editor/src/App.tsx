import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosCloud } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import codeEditorLogo from "./assets/code.png";
import ProfileLogo from "./assets/def-profile.svg";
import ErrorBoundary from "./error/ErrorBoundry";
import Css from "./components/Css";
import Html from "./components/Html";
import Js from "./components/Js";
import Output from "./components/Output";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Save from "./pages/Save";
import Sidebar from "./pages/Sidebar";
import Account from "./profile/Account";

export interface User {
  name: string;
  email: string;
  profileImage?: string;
  _id?: string;
}

interface SavedProject {
  _id: string;
  title: string;
  description?: string;
  date: string | Date;
  userId: string;
}

const App = () => {
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const navigate = useNavigate();

  // Check for existing user session on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      fetchSavedProjects(userData._id);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedProjects([]);
    }
  }, [user]);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const handleLogout = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });
    } finally {
      setUser(null);
      setSavedProjects([]);
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const handleProjectSelect = (project: {
    htmlCode: string;
    cssCode: string;
    jsCode: string;
  }) => {
    setHtmlCode(project.htmlCode || "");
    setCssCode(project.cssCode || "");
    setJsCode(project.jsCode || "");
  };

  const handleNewProject = () => {
    if (htmlCode || cssCode || jsCode) {
      const confirm = window.confirm(
        "Are you sure you want to start a new project? Any unsaved changes will be lost."
      );
      if (confirm) {
        setHtmlCode("");
        setCssCode("");
        setJsCode("");
      }
    } else {
      setHtmlCode("");
      setCssCode("");
      setJsCode("");
    }
  };

  const fetchSavedProjects = async (userId?: string) => {
    if (!userId) return;
    try {
      const response = await axios.get("http://localhost:3001/savedCode", {
        withCredentials: true, // Important for session
      });
      setSavedProjects(response.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setSavedProjects([]);
    }
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    fetchSavedProjects(userData._id);

    //* Ensuring the session cookie is stored *//
    document.cookie = `connect.sid=; Path=/; HttpOnly; SameSite=Lax`;
  };

  return (
    <>
      {/* Navigation */}
      <header className="flex items-center justify-between p-4 md:p-6 bg-slate-800 shadow-md">
        <nav className="flex items-center gap-4 md:gap-6">
          <button
            onClick={toggleSidebar}
            className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm cursor-pointer"
          >
            <RxHamburgerMenu className="text-slate-200 w-4 h-4" />
          </button>

          <Link
            to={"/"}
            className="flex items-center gap-3 hover:scale-105 transition-transform"
          >
            <img
              width="40"
              height="40"
              src={codeEditorLogo}
              alt="Code Editor Logo"
              className="block"
            />
            <h1 className="text-xl md:text-3xl font-bold text-white font-mono">
              UI Code Editor
            </h1>
          </Link>
        </nav>

        <nav className="flex gap-4 md:gap-6 items-center">
          {user ? (
            <>
              <Link to={"/save"}>
                <button className="text-white py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-400 cursor-pointer transition-all duration-200 flex items-center gap-2 text-md">
                  <IoIosCloud className="text-xl" />
                  <span>Save</span>
                </button>
              </Link>
              <Link to={"/account"}>
                <button className="cursor-pointer transition-all duration-200 hover:scale-110">
                  <img
                    src={user?.profileImage || ProfileLogo}
                    alt={user?.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-white"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = ProfileLogo;
                    }}
                  />
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to={"/signup"}>
                <button className="text-white py-2 px-4 rounded-lg bg-green-600 hover:bg-green-500 cursor-pointer transition-all duration-200 text-md">
                  Sign Up
                </button>
              </Link>
              <Link to={"/login"}>
                <button className="text-white py-2 px-4 rounded-lg bg-gray-600 hover:bg-gray-500 cursor-pointer transition-all duration-200 text-md">
                  Login
                </button>
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Routes */}
      <div className="flex justify-center items-center mt-4 md:mt-10 px-2">
        <Routes>
          <Route
            path="/save"
            element={
              <Save htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode} />
            }
          />
          <Route
            path="/signup"
            element={<Signup onAuthSuccess={handleAuthSuccess} />}
          />
          <Route
            path="/login"
            element={<Login onAuthSuccess={handleAuthSuccess} />}
          />
          <Route
            path="/account"
            element={<Account user={user} handleLogout={handleLogout} />}
          />
        </Routes>
      </div>

      {/* Main Content */}
      {!window.location.pathname.includes("/account") && (
        <>
          <div className="flex flex-col w-full p-1 md:p-2 mt-4 md:mt-20 gap-2 md:gap-4">
            {showSidebar && (
              <ErrorBoundary fallback={<div>Error loading sidebar</div>}>
                <Sidebar
                  savedProjects={savedProjects}
                  setSavedProjects={setSavedProjects}
                  onClose={toggleSidebar}
                  onProjectSelect={handleProjectSelect}
                  onNewProject={handleNewProject}
                  isAuthenticated={!!user}
                  currentUserId={user?._id}
                />
              </ErrorBoundary>
            )}

            <div className="flex flex-col justify-center items-center md:flex-row gap-4 p-2 mx-2 mt-4 md:justify-center md:items-center">
              <Html htmlCode={htmlCode} setHtmlCode={setHtmlCode} />
              <Css cssCode={cssCode} setCssCode={setCssCode} />
              <Js jsCode={jsCode} setJsCode={setJsCode} />
            </div>
          </div>

          <div className="w-full px-2 mt-4 md:mt-10 mb-10 md:mb-10">
            <Output htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode} />
          </div>
        </>
      )}
    </>
  );
};

export default App;
