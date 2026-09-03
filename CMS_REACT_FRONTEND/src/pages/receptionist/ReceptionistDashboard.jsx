import { useEffect, useState } from "react";
import api from "../../services/api";

function ReceptionistDashboard() {
  const name =
    localStorage.getItem("name") ||
    localStorage.getItem("username") ||
    "Receptionist";

  const [dashboardData, setDashboardData] = useState({
    total_patients: 0,
    today_appointments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "receptionist/dashboard/"
      );

      setDashboardData({
        total_patients: response.data.total_patients ?? 0,
        today_appointments:
          response.data.today_appointments ?? 0,
      });
    } catch (error) {
      console.error(
        "Error loading receptionist dashboard:",
        error
      );

      setError("Unable to load dashboard details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{
        minHeight: "calc(100vh - 120px)",
      }}
    >
      {/* WELCOME SECTION */}

      <div className="text-center mt-4 mb-5">
        <h2 className="fw-bold mb-3">
          Welcome, {name} 👋
        </h2>

        <h5 className="mb-2">
          You are logged in as Receptionist.
        </h5>

        <p className="text-muted mb-0">
          You can manage patients, appointments and
          consultation bills from the menu.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div
          className="alert alert-danger text-center w-100"
          style={{ maxWidth: "750px" }}
        >
          {error}
        </div>
      )}

      {/* DASHBOARD CARDS */}

      {loading ? (
        <div className="text-center mt-4">
          <div
            className="spinner-border"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="mt-2 text-muted">
            Loading dashboard...
          </p>
        </div>
      ) : (
        <div
          className="row g-4 justify-content-center w-100"
          style={{
            maxWidth: "850px",
          }}
        >
          {/* TOTAL PATIENTS */}

          <div className="col-12 col-md-6">
            <div
              className="card shadow-sm h-100 border-0"
              style={{
                borderRadius: "12px",
              }}
            >
              <div className="card-body text-center p-4">
                <div
                  className="mb-3"
                  style={{
                    fontSize: "42px",
                  }}
                >
                  👥
                </div>

                <h5 className="fw-semibold">
                  Total Patients Registered Till Date
                </h5>

                <h2
                  className="fw-bold mt-3 mb-0"
                  style={{
                    color: "#1976A3",
                  }}
                >
                  {dashboardData.total_patients}
                </h2>
              </div>
            </div>
          </div>

          {/* TODAY'S APPOINTMENTS */}

          <div className="col-12 col-md-6">
            <div
              className="card shadow-sm h-100 border-0"
              style={{
                borderRadius: "12px",
              }}
            >
              <div className="card-body text-center p-4">
                <div
                  className="mb-3"
                  style={{
                    fontSize: "42px",
                  }}
                >
                  📅
                </div>

                <h5 className="fw-semibold">
                  Total Appointments on Current Date
                </h5>

                <h2
                  className="fw-bold mt-3 mb-0"
                  style={{
                    color: "#1976A3",
                  }}
                >
                  {dashboardData.today_appointments}
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceptionistDashboard;

