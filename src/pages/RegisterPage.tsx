// src/pages/RegisterPage.tsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUiError, type UiError } from "../util/getUiError";
import type { ApiError } from "../api/apiClient";

type Role = "ROLE_USER" | "ROLE_MANAGER" | "ROLE_ADMIN";

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

const initialForm: RegisterForm = {
  username: "",
  password: "",
  confirmPassword: "",
  role: "ROLE_USER",
};

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  // redirect back to where the user came from, or default to /
  const from = (location.state as { from?: string })?.from ?? "/";

  const set =
    (field: keyof RegisterForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (): UiError | null => {
    if (!form.username.trim()) {
      return {
        message: "Validation failed",
        fieldErrors: {
          username: "Username is required",
        },
      };
    }
    if (form.username.length > 64) {
      return {
        message: "Validation failed",
        fieldErrors: {
          username: "Username must be 64 characters or fewer",
        },
      };
    }
    if (form.password.length < 8) {
      return {
        message: "Validation failed",
        fieldErrors: {
          password: "Password must be at least 8 characters",
        },
      };
    }
    if (form.password !== form.confirmPassword) {
      return {
        message: "Validation failed",
        fieldErrors: {
          confirmPassword: "Passwords do not match",
        },
      };
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await register(form.username, form.password, form.role);
      navigate(from, { replace: true });
    } catch (e: unknown) {
      // can only pass unknown
      setError(getUiError(e));
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create account
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Hardship Application Portal
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error.message}
            {error.fieldErrors && (
              <ul className="mt-2 list-disc list-inside">
                {Object.entries(error.fieldErrors).map(([field, message]) => (
                  <li key={field}>
                    {field}:{message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className={labelCls}>
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={64}
              value={form.username}
              onChange={set("username")}
              className={inputCls}
              placeholder="e.g. johndoe"
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div>
            <label className={labelCls}>
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={set("password")}
              className={inputCls}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className={labelCls}>
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              className={inputCls}
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />
          </div>

          {/* Role */}
          <div>
            <label className={labelCls}>Role</label>
            <select
              value={form.role}
              onChange={set("role")}
              className={inputCls}
            >
              <option value="ROLE_USER">User</option>
              <option value="ROLE_MANAGER">Manager</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              In production, role assignment would be admin-only.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors text-sm"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
