import { NavLink } from "react-router-dom";

function DoctorDashboard() {
  return (
    <div>
      <div className="nav flex-column">
        <NavLink to="/doctor">
          <i className="bi bi-grid-1x2-fill me-2"></i>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/doctor/appointments">
          <i className="bi bi-calendar-check-fill me-2"></i>
          <span>Appointments</span>
        </NavLink>

        <NavLink to="/doctor/patients">
          <i className="bi bi-people-fill me-2"></i>
          <span>Patients</span>
        </NavLink>

        <NavLink to="/doctor/consultations">
          <i className="bi bi-clipboard2-pulse-fill me-2"></i>
          <span>Consultations</span>
        </NavLink>

        <NavLink to="/doctor/prescriptions">
          <i className="bi bi-prescription2 me-2"></i>
          <span>Prescriptions</span>
        </NavLink>

        <NavLink to="/doctor/lab-orders">
          <i className="bi bi-clipboard2-data-fill me-2"></i>
          <span>Lab Orders</span>
        </NavLink>
      </div>
    </div>
  );
}

export default DoctorDashboard;
