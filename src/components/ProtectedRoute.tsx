import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute(
  { children }: { children: React.ReactNode },
  // roles: string,
) {
  const { user, loading } = useAuth();

  // wait for /me to finish before making any decision
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // only redirect if the user is not null
  if (!user) return <Navigate to={"/login"} replace />;

  // if (roles && !roles.includes(user.role)) {
  //   return <Navigate to={"/forbidden"} replace />;
  // }

  return <>{children}</>;
}
