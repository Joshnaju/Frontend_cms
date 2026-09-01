import { Routes, Route, Navigate } from "react-router-dom";

// import DoctorLayout from "../components/doctor/DoctorLayout";

import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorLayout from "../components/doctor/DoctorLayout";
// import Appointments from "../pages/doctor/Appointments";
// import Patients from "../pages/doctor/Patients";
// import Consultations from "../pages/doctor/Consultations";
// import Prescriptions from "../pages/doctor/Prescriptions";
// import LabOrders from "../pages/doctor/LabOrders";

function DoctorRoutes() {
  return (
    <Routes>
      <Route element={<DoctorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<DoctorDashboard />} />

        {/* <Route path="appointments" element={<Appointments />} />

        <Route path="patients" element={<Patients />} />

        <Route path="consultations" element={<Consultations />} />

        <Route path="prescriptions" element={<Prescriptions />} />

        <Route path="lab-orders" element={<LabOrders />} /> */}
      </Route>
    </Routes>
  );
}

export default DoctorRoutes;
