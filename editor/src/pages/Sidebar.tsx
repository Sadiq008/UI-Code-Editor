import { RxCross2 } from "react-icons/rx";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface SavedProject {
  _id: string;
  title: string;
  description?: string;
  date: string | Date;
  userId: string;
}

interface SidebarProps {
  savedProjects: SavedProject[];
  setSavedProjects: React.Dispatch<React.SetStateAction<SavedProject[]>>;
  onClose: () => void;
  onProjectSelect: (project: {
    htmlCode: string;
    cssCode: string;
    jsCode: string;
  }) => void;
  onNewProject: () => void;
  isAuthenticated: boolean;
  currentUserId?: string;
}

const Sidebar = ({
  savedProjects,
  setSavedProjects,
  onClose,
  onProjectSelect,
  onNewProject,
  isAuthenticated,
  currentUserId,
}: SidebarProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<{
    id: string | null;
    title: string;
    description: string;
  }>({ id: null, title: "", description: "" });

  // Add animation styles to the head
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          to { opacity: 0; }
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOut {
          to { transform: translateX(-100%); }
        }
      `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleProjectClick = async (projectId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/savedCode/${projectId}`,
        { withCredentials: true }
      );

      // Verify the project belongs to the current user
      if (response.data.userId !== currentUserId) {
        throw new Error("You don't have permission to access this project");
      }

      onProjectSelect(response.data);
      onClose();
    } catch (err) {
      console.error("Error loading project:", err);
      toast.error("You can only access your own projects");
    }
  };

  const handleDeleteProject = async (
    projectId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this project?"
      );
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:3001/savedCode/${projectId}`, {
        withCredentials: true,
      });
      setSavedProjects(
        savedProjects.filter((project) => project._id !== projectId)
      );
    } catch (err) {
      setError("Failed to delete project");
      console.error("Error deleting project:", err);
    }
  };

  const handleEditProject = (project: SavedProject) => {
    setEditingProject({
      id: project._id,
      title: project.title,
      description: project.description || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingProject({ id: null, title: "", description: "" });
  };

  const handleUpdateProject = async () => {
    try {
      await axios.patch(
        `http://localhost:3001/savedCode/${editingProject.id}`,
        {
          title: editingProject.title,
          description: editingProject.description,
        },
        { withCredentials: true }
      );

      setSavedProjects(
        savedProjects.map((project) =>
          project._id === editingProject.id
            ? {
                ...project,
                title: editingProject.title,
                description: editingProject.description,
              }
            : project
        )
      );
      handleCancelEdit();
    } catch (err) {
      setError("Failed to update project");
      console.error("Error updating project:", err);
    }
  };

  return (
    <>
      {/* Overlay with animation */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
        style={{
          opacity: isClosing ? 1 : 0,
          animation: isClosing
            ? "fadeOut 0.3s ease-in forwards"
            : "fadeIn 0.3s ease-out forwards",
        }}
      />

      {/* Sidebar with animation */}
      <aside
        className="fixed inset-y-0 left-0 z-50 w-64 h-full bg-slate-800 border-r border-slate-700/50 shadow-2xl"
        aria-label="Sidebar"
        style={{
          transform: isClosing ? "translateX(0)" : "translateX(-100%)",
          animation: isClosing
            ? "slideOut 0.3s ease-in forwards"
            : "slideIn 0.3s ease-out forwards",
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
            <h2 className="text-xl font-semibold text-slate-200">UI Editor</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all focus:outline-none focus:ring-2 focus:ring-slate-500 cursor-pointer"
              aria-label="Close sidebar"
            >
              <RxCross2 className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="mb-4">
              <button
                onClick={onNewProject}
                className="w-full py-2 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl cursor-pointer"
              >
                New Project
              </button>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-slate-200 mb-2">
                Saved Projects
              </h3>

              {!isAuthenticated ? (
                <p className="text-slate-400">
                  Please log in to view saved projects.
                </p>
              ) : loading ? (
                <p className="text-slate-400">Loading projects...</p>
              ) : error ? (
                <p className="text-red-400">{error}</p>
              ) : savedProjects.length === 0 ? (
                <p className="text-slate-400">No projects saved yet</p>
              ) : (
                <ul className="space-y-2">
                  {savedProjects.map((project) => (
                    <li
                      key={project._id}
                      className="group p-2 hover:bg-slate-700/50 rounded cursor-pointer flex flex-col"
                    >
                      {editingProject.id === project._id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editingProject.title}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                title: e.target.value,
                              })
                            }
                            className="w-full p-1 bg-slate-700 text-slate-200 rounded"
                          />
                          <textarea
                            value={editingProject.description}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                description: e.target.value,
                              })
                            }
                            className="w-full p-1 bg-slate-700 text-slate-200 rounded text-sm"
                            rows={3}
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={handleCancelEdit}
                              className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleUpdateProject}
                              className="p-1 text-green-400 hover:text-green-300 cursor-pointer"
                            >
                              <FaSave className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div
                            className="flex-1"
                            onClick={() => handleProjectClick(project._id)}
                          >
                            <h4 className="text-slate-200">{project.title}</h4>
                            {project.description &&
                              project.description.trim() !== "" && (
                                <p className="text-sm text-slate-400 mt-1">
                                  {project.description}
                                </p>
                              )}
                            <p className="text-xs text-slate-500 mt-1">
                              {typeof project.date === "string"
                                ? new Date(project.date).toLocaleDateString()
                                : project.date.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditProject(project);
                              }}
                              className="p-1 text-slate-400 hover:text-blue-500 cursor-pointer"
                            >
                              <FaEdit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) =>
                                handleDeleteProject(project._id, e)
                              }
                              className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </nav>

          <div className="p-4 border-t border-slate-700/50">
            <p className="text-sm text-slate-400">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
