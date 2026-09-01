import { Outlet } from "react-router-dom";
import DoctorSidebar from "./DoctorSidebar";

function DoctorLayout() {
  return (
    <div className="d-flex w-100">
      <DoctorSidebar />

      <main className="flex-grow-1 bg-light p-4" style={{ minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default DoctorLayout;
