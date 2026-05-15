import { Routes, Route } from "react-router-dom"; //need to install "react-router-dom"
import "./App.css";
import { Header } from "./components/Header";
import { HardshipForm } from "./components/HardshipForm";
import { ApplicationList } from "./components/ApplicationList";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              // wrap with protected route
              <ProtectedRoute>
                <HardshipForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lists"
            element={
              // wrap with protected route
              <ProtectedRoute>
                <ApplicationList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
