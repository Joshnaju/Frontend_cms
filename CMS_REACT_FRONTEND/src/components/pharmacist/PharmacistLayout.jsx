import { Outlet } from "react-router-dom";
import PharmacistSidebar from "./PharmacistSidebar";

function PharmacistLayout() {
  return (
    <div className="d-flex w-100">
      <PharmacistSidebar />

      <main
        className="flex-grow-1 bg-light p-4"
        style={{ minWidth: 0 }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default PharmacistLayout;