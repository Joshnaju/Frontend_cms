import { Routes, Route, Navigate } from "react-router-dom";

import DoctorLayout from "../components/doctor/DoctorLayout";

import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import Appointments from "../pages/doctor/appointment/Appointments";
import Consultation from "../pages/doctor/appointment/Consultation";
import ConsultationView from "../pages/doctor/appointment/ConsultationView";
import DoctorPatientsHistroy from "../pages/doctor/patients/DoctorPatientsHistroy";
import DoctorPatientView from "../pages/doctor/patients/DoctorPatientView";
import ConsultationDetails from "../pages/doctor/patients/ConsultationDetails";
import NotFound from "../pages/NotFound";

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
        <Route path="patients" element={<DoctorPatientsHistroy />} />
        <Route path="patients/:patientId" element={<DoctorPatientView />} />
        <Route
          path="patients/:patientId/consultation/:appointmentId"
          element={<ConsultationDetails />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default DoctorRoutes;
