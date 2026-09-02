import { useState } from "react";
import { NavLink } from "react-router-dom";

function ReceptionistSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      path: "/receptionist/dashboard",
      icon: "🏠",
      label: "Dashboard",
    },
    {
      path: "/receptionist/patients",
      icon: "👥",
      label: "Patients",
    },
    {
      path: "/receptionist/appointments",
      icon: "📅",
      label: "Appointments",
    },
    {
      path: "/receptionist/consultation-bills",
      icon: "🧾",
      label: "Consultation Bills",
    },
  ];

  return (
    <aside
      className="bg-white border-end flex-shrink-0"
      style={{
        width: collapsed ? "60px" : "240px",
        minHeight: "calc(100vh - 56px)",
        transition: "width 0.3s ease",
      }}
    >
      <div
        className={`p-3 border-bottom d-flex align-items-center ${
          collapsed
            ? "justify-content-center"
            : "justify-content-between"
        }`}
      >
        {!collapsed && (
          <h6 className="mb-0 fw-bold">
            🏥 Receptionist Menu
          </h6>
        )}

        <button
          type="button"
          className="btn btn-sm btn-light border"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand menu" : "Collapse menu"}
        >
          {collapsed ? "☰" : "‹"}
        </button>
      </div>

      <nav className="nav nav-pills flex-column p-2 gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : ""}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${
                collapsed ? "justify-content-center" : ""
              } ${
                isActive ? "text-white fw-bold" : "text-dark"
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#1976A3" : "transparent",
              borderRadius: "6px",
              padding: collapsed ? "10px 5px" : "10px 12px",
            })}
          >
            <span
              style={{
                width: collapsed ? "100%" : "24px",
                textAlign: "center",
                fontSize: "18px",
              }}
            >
              {item.icon}
            </span>

            {!collapsed && (
              <span className="ms-3">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default ReceptionistSidebar;


