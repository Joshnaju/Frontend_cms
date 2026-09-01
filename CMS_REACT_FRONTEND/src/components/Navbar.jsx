import { useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    switch (user.role) {
      case "ADMIN":
        navigate("/admin/dashboard");
        break;

      case "DOCTOR":
        navigate("/doctor/dashboard");
        break;

      case "RECEPTIONIST":
        navigate("/receptionist/dashboard");
        break;

      case "PHARMACIST":
        navigate("/pharmacist/dashboard");
        break;

      case "LAB_TECHNICIAN":
        navigate("/lab/dashboard");
        break;

      default:
        navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("name");
    localStorage.removeItem("role");

    // Update App state
    setUser(null);

    navigate("/login");
  };

  return (
    <nav className="navbar-expand-lg px-3 navbar navbar-dark bg-primary">
      {/* Logo */}
      <button
        className="btn text-white fw-bold fs-5 d-flex align-items-center"
        style={{
          border: "none",
        }}
        onClick={handleLogoClick}
      >
        <img
          src="/hospital.png"
          alt="Hospital"
          width="35"
          height="35"
          className="me-2"
        />
        Clinical Management System
      </button>

      {/* User + Logout */}
      {user && (
        <div className="ms-auto d-flex align-items-center">
          <span className="text-white me-4">
            {user.role === "DOCTOR" && "Dr. "}

            {user.name}
          </span>

          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
