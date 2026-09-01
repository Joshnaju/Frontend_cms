import { useState } from "react";
import { NavLink } from "react-router-dom";

function DoctorSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      path: "/doctor/dashboard",
      icon: "🏠",
      label: "Dashboard",
    },
    {
      path: "/doctor/appointments",
      icon: "📅",
      label: "Appointments",
    },
    {
      path: "/doctor/patients",
      icon: "👥",
      label: "Patients",
    },
    {
      path: "/doctor/consultations",
      icon: "🩺",
      label: "Consultations",
    },
    {
      path: "/doctor/prescriptions",
      icon: "💊",
      label: "Prescriptions",
    },
    {
      path: "/doctor/lab-orders",
      icon: "🧪",
      label: "Lab Orders",
    },
  ];

  return (
    <div
      className="bg-light border-end position-relative"
      style={{
        width: collapsed ? "60px" : "240px",
        minHeight: "calc(100vh - 56px)",
        transition: "width 0.3s ease",
      }}
    >
      {/* Collapse Button */}
      <button
        type="button"
        className="btn btn-light border-0 position-absolute"
        style={{
          right: "-18px",
          top: "10px",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          zIndex: 10,
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "▶" : "◀"}
      </button>

      {/* Doctor Menu */}
      {!collapsed && (
        <div className="p-3">
          <h6 className="text-muted text-uppercase mb-3">🩺 Doctor Menu</h6>

          <div className="nav flex-column">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${
                    isActive ? "active fw-bold text-primary" : "text-dark"
                  }`
                }
              >
                {item.icon} {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Collapsed Menu */}
      {collapsed && (
        <div className="d-flex flex-column align-items-center pt-5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link fs-5 mb-2 ${isActive ? "text-primary" : "text-dark"}`
              }
              title={item.label}
            >
              {item.icon}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorSidebar;
