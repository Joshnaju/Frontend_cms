import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctorDashboard } from "../../services/doctorService";

function DoctorDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    total_patients: 0,
    today_appointments: 0,
    completed_today: 0,
    scheduled_today: 0,
  });

  const [doctorName, setDoctorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDoctorDashboard();

      setDashboard(data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get doctor name from localStorage
    const storedDoctorName = localStorage.getItem("name");

    if (storedDoctorName) {
      setDoctorName(
        storedDoctorName.charAt(0).toUpperCase() + storedDoctorName.slice(1),
      );
    }

    fetchDashboard();
  }, []);

  return (
    <div className="container-fluid py-4">
      {/* HEADER */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-3 mb-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "52px",
              height: "52px",
              backgroundColor: "#e8f1ff",
            }}
          >
            <i className="bi bi-person-badge fs-3 text-primary"></i>
          </div>

          <div>
            <h3 className="fw-semibold mb-1">
              Welcome{doctorName ? `, Dr. ${doctorName}` : ""}
            </h3>

            <p className="text-muted mb-0">
              Here's your practice overview for today.
            </p>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* DASHBOARD CARDS */}
      <div className="row g-4">
        {/* TOTAL PATIENTS */}
        <div className="col-xl-3 col-md-6">
          <div
            className="card border-0 shadow-sm h-100 dashboard-card"
            onClick={() => navigate("/doctor/patients")}
            style={{
              cursor: "pointer",
              background: "linear-gradient(135deg, #4f8cff, #2864d7)",
              borderRadius: "16px",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 10px 25px rgba(40, 100, 215, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 .125rem .25rem rgba(0,0,0,.075)";
            }}
          >
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-2 opacity-75">Total Patients</p>

                  <h1 className="fw-bold mb-1">
                    {loading ? "..." : dashboard.total_patients}
                  </h1>

                  <small className="opacity-75">View your patients</small>
                </div>

                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "55px",
                    height: "55px",
                    backgroundColor: "rgba(255,255,255,0.20)",
                  }}
                >
                  <i className="bi bi-people fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TODAY'S APPOINTMENTS */}
        <div className="col-xl-3 col-md-6">
          <div
            className="card border-0 shadow-sm h-100"
            onClick={() => navigate("/doctor/appointments")}
            style={{
              cursor: "pointer",
              background: "linear-gradient(135deg, #20b486, #12815f)",
              borderRadius: "16px",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 10px 25px rgba(18, 129, 95, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 .125rem .25rem rgba(0,0,0,.075)";
            }}
          >
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-2 opacity-75">Today's Appointments</p>

                  <h1 className="fw-bold mb-1">
                    {loading ? "..." : dashboard.today_appointments}
                  </h1>

                  <small className="opacity-75">
                    View today's appointments
                  </small>
                </div>

                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "55px",
                    height: "55px",
                    backgroundColor: "rgba(255,255,255,0.20)",
                  }}
                >
                  <i className="bi bi-calendar-check fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COMPLETED TODAY */}
        <div className="col-xl-3 col-md-6">
          <div
            className="card border-0 shadow-sm h-100"
            onClick={() => navigate("/doctor/appointments")}
            style={{
              cursor: "pointer",
              background: "linear-gradient(135deg, #3fa65c, #24733b)",
              borderRadius: "16px",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 10px 25px rgba(36, 115, 59, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 .125rem .25rem rgba(0,0,0,.075)";
            }}
          >
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-2 opacity-75">Completed Today</p>

                  <h1 className="fw-bold mb-1">
                    {loading ? "..." : dashboard.completed_today}
                  </h1>

                  <small className="opacity-75">Completed consultations</small>
                </div>

                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "55px",
                    height: "55px",
                    backgroundColor: "rgba(255,255,255,0.20)",
                  }}
                >
                  <i className="bi bi-check-circle fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SCHEDULED TODAY */}
        <div className="col-xl-3 col-md-6">
          <div
            className="card border-0 shadow-sm h-100"
            onClick={() => navigate("/doctor/appointments")}
            style={{
              cursor: "pointer",
              background: "linear-gradient(135deg, #f0a73a, #d47b0c)",
              borderRadius: "16px",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 10px 25px rgba(212, 123, 12, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 .125rem .25rem rgba(0,0,0,.075)";
            }}
          >
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-2 opacity-75">Scheduled Today</p>

                  <h1 className="fw-bold mb-1">
                    {loading ? "..." : dashboard.scheduled_today}
                  </h1>

                  <small className="opacity-75">Waiting for consultation</small>
                </div>

                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "55px",
                    height: "55px",
                    backgroundColor: "rgba(255,255,255,0.20)",
                  }}
                >
                  <i className="bi bi-clock fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
