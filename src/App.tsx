import { Routes, Route } from "react-router-dom"; //need to install "react-router-dom"
import "./App.css";
import { Header } from "./components/Header";
import { HardshipForm } from "./components/HardshipForm";
import { ApplicationList } from "./components/ApplicationList";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HardshipForm />} />
          <Route path="/lists" element={<ApplicationList />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
