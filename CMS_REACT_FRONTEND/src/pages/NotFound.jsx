import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    const token = localStorage.getItem("access");

    if (token) {
      const role = localStorage.getItem("role");

      switch (role) {
        case "DOCTOR":
          navigate("/doctor/dashboard");
          break;

        case "ADMIN":
          navigate("/admin/dashboard");
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
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="text-center">
        <div className="mb-3">
          <img
            src="/hospital.png"
            alt="Clinical Management System"
            width="80"
            height="80"
          />
        </div>

        <h1 className="display-1 fw-bold text-primary-emphasis">404</h1>

        <h2 className="fw-bold text-primary-emphasis">Page Not Found</h2>

        <p className="text-muted mb-4">
          Sorry, the page you are looking for does not exist.
        </p>

        <button
          className="btn text-white btn-dark  px-4"
          onClick={handleGoHome}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default NotFound;
