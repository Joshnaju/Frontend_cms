import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DoctorRoutes from "./routes/DoctorRoutes";
import ReceptionistRoutes from "./routes/ReceptionistRoutes";
import PharmacistRoutes from "./routes/PharmacistRoutes";
import MedicineInventory from "./pages/pharmacist/MedicineInventory";

function App() {
  const [user, setUser] = useState(null);

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

        {/* =========================
            DOCTOR MODULE
        ========================== */}

        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute>
              <DoctorRoutes />
            </ProtectedRoute>
          }
        />

        {/* =========================
    RECEPTIONIST MODULE
========================== */}

        <Route
          path="/receptionist/*"
          element={
            <ProtectedRoute>
              <ReceptionistRoutes />
            </ProtectedRoute>
          }
        />

        {/* =========================
            PHARMACIST MODULE
        ========================== */}
        <Route
          path="/pharmacist/*"
          element={
            <ProtectedRoute>
              <PharmacistRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/medicine-inventory"
          element={<MedicineInventory />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
