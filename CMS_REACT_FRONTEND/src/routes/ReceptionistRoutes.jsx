import { Routes, Route, Navigate } from "react-router-dom";

import ReceptionistLayout from "../components/receptionist/ReceptionistLayout";

import ReceptionistDashboard from "../pages/receptionist/ReceptionistDashboard";
import Patients from "../pages/receptionist/Patients";
import Appointments from "../pages/receptionist/Appointments";
import ConsultationBills from "../pages/receptionist/ConsultationBills";

function ReceptionistRoutes() {
  return (
    <Routes>
      <Route element={<ReceptionistLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route
          path="dashboard"
          element={<ReceptionistDashboard />}
        />

        <Route
          path="patients"
          element={<Patients />}
        />

        <Route
          path="appointments"
          element={<Appointments />}
        />

        <Route
          path="consultation-bills"
          element={<ConsultationBills />}
        />
      </Route>
    </Routes>
  );
}

export default ReceptionistRoutes;

