import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../context/AuthContext";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout;
    navigate("/login");
  };

  // ── Role badge ────────────────────────────────────────────────────────────
  const roleLabel = {
    ROLE_ADMIN: { text: "Admin", cls: "bg-purple-100 text-purple-800" },
    ROLE_MANAGER: { text: "Manager", cls: "bg-blue-100   text-blue-800" },
    ROLE_USER: { text: "User", cls: "bg-gray-100   text-gray-700" },
  }[user?.role ?? ""] ?? { text: user?.role, cls: "bg-gray-100 text-gray-700" };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors px-6 py-3 flex items-center justify-between">
      <span className="text-xl font-bold text-gray-900 dark:text-white">
        HardshipForm
      </span>
      {user?.username && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-900 dark:text-white">
            {user?.username}
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${roleLabel.cls}`}
            >
              {roleLabel.text}
            </span>
          </span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <nav className="flex gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`
            }
          >
            New Application
          </NavLink>
          <NavLink
            to="/lists"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`
            }
          >
            All Applications
          </NavLink>
        </nav>

        <button
          className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          onClick={toggleTheme}
        >
          {theme === "light" ? "🌚" : "🌞"}
        </button>
        <button
          onClick={handleLogout}
          className="p-2 font-semibold rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
