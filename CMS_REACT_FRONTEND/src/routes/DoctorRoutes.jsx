import { Routes, Route, Navigate } from "react-router-dom";

import DoctorLayout from "../components/doctor/DoctorLayout";

import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import Appointments from "../pages/doctor/Appointments";

function DoctorRoutes() {
  return (
    <Routes>
      <Route element={<DoctorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<DoctorDashboard />} />

        <Route path="appointments" element={<Appointments />} />
      </Route>
    </Routes>
  );
}

export default DoctorRoutes;
