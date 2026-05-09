import { NavLink } from "react-router-dom";

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors px-6 py-3 flex items-center justify-between">
      <span className="text-xl font-bold text-gray-900 dark:text-white">
        HardshipForm
      </span>
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
      </div>
    </header>
  );
}
