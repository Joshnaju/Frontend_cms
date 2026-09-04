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
    // {
    //   path: "/doctor/consultations",
    //   icon: "🩺",
    //   label: "Consultations",
    // },
    // {
    //   path: "/doctor/prescriptions",
    //   icon: "💊",
    //   label: "Prescriptions",
    // },
    // {
    //   path: "/doctor/lab-orders",
    //   icon: "🧪",
    //   label: "Lab Orders",
    // },
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
          collapsed ? "justify-content-center" : "justify-content-between"
        }`}
      >
        {!collapsed && <h6 className="mb-0 fw-bold">🩺 Doctor Menu</h6>}

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
              } ${isActive ? "text-white fw-bold" : "text-dark"}`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive
                ? "var(--bs-primary-text-emphasis)"
                : "transparent",
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

            {!collapsed && <span className="ms-3">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
//   return (
//     <aside
//       className="bg-white border-end flex-shrink-0"
//       style={{
//         width: collapsed ? "60px" : "240px",
//         minHeight: "calc(100vh - 56px)",
//         transition: "width 0.3s ease",
//       }}
//     >
//       {/* =========================
//           SIDEBAR CONTENT
//       ========================== */}

//       {!collapsed && (
//         <>
//           {/* Doctor Menu Header */}
//           <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
//             <h6 className="mb-0 fw-bold">🩺 Doctor Menu</h6>

//             {/* Collapse button */}
//             <button
//               type="button"
//               className="btn btn-sm btn-light border"
//               onClick={() => setCollapsed(true)}
//               title="Hide menu"
//             >
//               ‹
//             </button>
//           </div>

//           {/* Menu Items */}
//           <nav className="nav nav-pills flex-column p-2 gap-1">
//             {menuItems.map((item) => (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `nav-link d-flex align-items-center ${
//                     isActive ? "bg-primary text-white fw-bold" : "text-dark"
//                   }`
//                 }
//                 style={{
//                   borderRadius: "6px",
//                   transition: "background-color 0.2s ease",
//                 }}
//               >
//                 {/* Icon */}
//                 <span
//                   className="me-3"
//                   style={{
//                     width: "24px",
//                     textAlign: "center",
//                   }}
//                 >
//                   {item.icon}
//                 </span>

//                 {/* Label */}
//                 <span>{item.label}</span>
//               </NavLink>
//             ))}
//           </nav>
//         </>
//       )}

//       {/* =========================
//           COLLAPSED BUTTON
//       ========================== */}

//       {collapsed && (
//         <button
//           type="button"
//           className="btn btn-light border position-fixed"
//           onClick={() => setCollapsed(false)}
//           title="Show menu"
//           style={{
//             left: "10px",
//             top: "70px",
//             width: "38px",
//             height: "38px",
//             zIndex: 1050,
//           }}
//         >
//           ☰
//         </button>
//       )}
//     </aside>
//   );
// }

export default DoctorSidebar;
