import { Routes, Route, Navigate } from "react-router-dom";

import DoctorLayout from "../components/doctor/DoctorLayout";

import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import Appointments from "../pages/doctor/Appointments";
import Consultation from "../pages/doctor/Consultation";
import ConsultationView from "../pages/doctor/ConsultationView";

function DoctorRoutes() {
  return (
    <Routes>
      <Route element={<DoctorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="consultation/:appointmentId" element={<Consultation />} />
        <Route
          path="consultation/view/:appointmentId"
          element={<ConsultationView />}
        />
      </Route>
    </Routes>
  );
}

export default DoctorRoutes;
