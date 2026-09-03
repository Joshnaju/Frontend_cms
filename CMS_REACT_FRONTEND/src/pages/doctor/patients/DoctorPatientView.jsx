import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoctorPatient } from "../../../services/doctorService";

function DoctorPatientView() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatient = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDoctorPatient(patientId);

      setPatient(data);
      setConsultations(data.consultations || []);
    } catch (error) {
      console.error("Error fetching patient:", error);

      setError("Failed to load patient details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [patientId]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary-emphasis"
            role="status"
          ></div>

          <p className="text-muted mt-2 mb-0">Loading patient details...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  // =========================
  // PATIENT NOT FOUND
  // =========================
  if (!patient) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-warning">Patient not found.</div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="d-flex align-items-center mb-4">
        <button
          type="button"
          className="btn btn-light border me-3"
          onClick={() => navigate("/doctor/patients")}
          title="Back to Patients"
        >
          <i className="bi bi-arrow-left"></i>
        </button>

        <div>
          <h4 className="mb-1 fw-bold text-primary-emphasis">
            Patient Details
          </h4>

          <p className="text-muted mb-0">
            {patient.patient_id} - {patient.patient_name}
          </p>
        </div>
      </div>

      {/* =====================================================
          PATIENT INFORMATION
      ====================================================== */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-semibold">
            <i className="bi bi-person-circle text-primary-emphasis me-2 fe-4"></i>
            <span className="text-primary-emphasis">Patient Information</span>
          </h5>
        </div>

        <div className="card-body">
          <div className="row g-4">
            {/* Patient ID */}
            <div className="col-md-3">
              <label className="form-label text-muted small mb-1">
                Patient ID
              </label>
              <div className="fw-semibold">{patient.patient_id || "-"}</div>
            </div>

            {/* Patient Name */}
            <div className="col-md-3">
              <label className="form-label text-muted small mb-1">
                Patient Name
              </label>
              <div className="fw-semibold">{patient.patient_name || "-"}</div>
            </div>

            {/* Age */}
            <div className="col-md-3">
              <label className="form-label text-muted small mb-1">Age</label>
              <div className="fw-semibold">{patient.age || "-"}</div>
            </div>

            {/* Gender */}
            <div className="col-md-3">
              <label className="form-label text-muted small mb-1">Gender</label>
              <div className="fw-semibold">{patient.gender || "-"}</div>
            </div>

            {/* Blood Group */}
            <div className="col-md-3">
              <label className="form-label text-muted small mb-1">
                Blood Group
              </label>
              <div className="fw-semibold">{patient.blood_group || "-"}</div>
            </div>

            {/* Mobile */}
            <div className="col-md-3">
              <label className="form-label text-muted small mb-1">Mobile</label>
              <div className="fw-semibold">{patient.mobile_number || "-"}</div>
            </div>

            {/* Email */}
            <div className="col-md-3">
              <label className="form-label text-muted small mb-1">Email</label>
              <div className="fw-semibold">{patient.email || "-"}</div>
            </div>

            {/* Address */}
            <div className="col-md-3">
              <label className="form-label text-muted small mb-1">
                Address
              </label>
              <div className="fw-semibold">{patient.address || "-"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation History */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-semibold">
            <i className="bi bi-clock-history text-info me-2 fs-4"></i>
            <span className="text-primary-emphasis">Consultation History</span>
          </h5>
        </div>

        <div className="card-body">
          {consultations.length === 0 ? (
            <div className="text-center text-muted py-4">
              <i className="bi bi-file-medical fs-3 d-block mb-2"></i>
              No consultation history found.
            </div>
          ) : (
            consultations.map((consultation) => (
              <div key={consultation.id} className="border rounded p-3 mb-3">
                {/* Consultation Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="row g-4 flex-grow-1">
                    {/* Consultation Date */}
                    <div className="col-md-4">
                      <span className="text-muted small">
                        Consultation Date
                      </span>

                      <div className="fw-semibold">
                        {new Date(
                          consultation.consultation_date,
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Doctor */}
                    <div className="col-md-4">
                      <span className="text-muted small">Doctor</span>

                      <div className="fw-semibold">
                        {consultation.doctor_name || "-"}
                      </div>
                    </div>

                    {/* Department */}
                    <div className="col-md-4">
                      <span className="text-muted small">Department</span>

                      <div className="fw-semibold">
                        {consultation.department_name || "-"}
                      </div>
                    </div>
                  </div>

                  {/* View Consultation */}
                  <div className="ms-4">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark"
                      onClick={() =>
                        navigate(
                          `/doctor/patients/${patient.id}/consultation/${consultation.appointment}`,
                        )
                      }
                    >
                      <i className="bi bi-eye me-1"></i>
                      View Consultation
                    </button>
                  </div>
                </div>

                {/* Symptoms / Diagnosis / Notes */}
                <div className="row g-4">
                  {/* Symptoms */}
                  <div className="col-md-4">
                    <label className="text-muted small mb-1">Symptoms</label>

                    <div className="fw-semibold">
                      {consultation.symptoms || "-"}
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="col-md-4">
                    <label className="text-muted small mb-1">Diagnosis</label>

                    <div className="fw-semibold">
                      {consultation.diagnosis || "-"}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="col-md-4">
                    <label className="text-muted small mb-1">Notes</label>

                    <div className="fw-semibold">
                      {consultation.notes || "-"}
                    </div>
                  </div>
                </div>

                {/* Medicines */}
                {consultation.medicine_prescriptions?.length > 0 && (
                  <div className="mt-4">
                    <label className="text-muted small mb-2 d-block">
                      Medicines
                    </label>

                    <div className="d-flex flex-wrap gap-2">
                      {consultation.medicine_prescriptions.map((medicine) => (
                        <span
                          key={medicine.id}
                          className="badge bg-light text-dark border px-3 py-2"
                        >
                          {medicine.medicine_name ||
                            medicine.medicine?.name ||
                            "-"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lab Orders */}
                {consultation.lab_orders?.length > 0 && (
                  <div className="mt-3">
                    <label className="text-muted small mb-2 d-block">
                      Lab Orders
                    </label>

                    <div className="d-flex flex-wrap gap-2">
                      {consultation.lab_orders.map((lab) => (
                        <span
                          key={lab.id}
                          className="badge bg-light text-dark border px-3 py-2"
                        >
                          {lab.lab_test_name || lab.lab_test?.name || "-"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorPatientView;
