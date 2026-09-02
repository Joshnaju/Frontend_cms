import { Outlet } from "react-router-dom";
import ReceptionistSidebar from "./ReceptionistSidebar";

function ReceptionistLayout() {
  return (
    <div className="d-flex w-100">
      <ReceptionistSidebar />

      <main className="flex-grow-1 bg-light p-4" style={{ minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default ReceptionistLayout;




