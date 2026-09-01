import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DoctorRoutes from "./routes/DoctorRoutes";

function App() {
  const [user, setUser] = useState(null);

  // Load user when application starts
  useEffect(() => {
    const access = localStorage.getItem("access");

    if (access) {
      setUser({
        access: access,
        refresh: localStorage.getItem("refresh"),
        username: localStorage.getItem("username"),
        name: localStorage.getItem("name"),
        role: localStorage.getItem("role"),
      });
    }
  }, []);

  return (
    <BrowserRouter>
      {/* Common Navbar */}
      <Navbar user={user} setUser={setUser} />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Common protected layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Common routes can come here */}
        </Route>

        {/* Doctor routes */}
        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute>
              <DoctorRoutes />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
