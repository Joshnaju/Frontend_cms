import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="container-fluid mt-4">
      <Outlet />
    </div>
  );
}

export default Layout;
