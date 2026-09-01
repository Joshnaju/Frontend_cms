import { Outlet } from "react-router-dom";
import DoctorSidebar from "./DoctorSidebar";

function DoctorLayout() {
  return (
    <div className="d-flex">
      <DoctorSidebar />

      <main className="flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default DoctorLayout;
