/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPatientByAppointment } from "../../../services/doctorService";
import { frequencyOptions } from "../../../constants/doctor/doctor";

function ConsultationDetails() {
  const { patientId, appointmentId } = useParams();
  const navigate = useNavigate();

  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchConsultation = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPatientByAppointment(patientId, appointmentId);

      setConsultation(data);
    } catch (error) {
      console.error("Error fetching consultation:", error);
      setError("Failed to load consultation details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultation();
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary-emphasis"></div>

          <div className="mt-2 text-muted">Loading consultation...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning">Consultation not found.</div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* HEADER */}
      <div className="d-flex align-items-center mb-4">
        <button
          type="button"
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left me-1"></i>
          Back
        </button>

        <div>
          <h4 className="mb-1 fw-semibold">Consultation Details</h4>
        </div>
      </div>

      {/* CONSULTATION INFORMATION */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-semibold">
            <i className="bi bi-clipboard2-pulse text-primary me-2"></i>
            Consultation Information
          </h5>
        </div>

        <div className="card-body">
          <div className="row g-4">
            {/* DATE */}
            <div className="col-md-4">
              <label className="text-muted small mb-1">Consultation Date</label>

              <div className="fw-semibold">
                {consultation.consultation_date
                  ? new Date(consultation.consultation_date).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )
                  : "-"}
              </div>
            </div>

            {/* DOCTOR */}
            <div className="col-md-4">
              <label className="text-muted small mb-1">Doctor</label>

              <div className="fw-semibold">
                {consultation.doctor_name || "-"}
              </div>
            </div>

            {/* DEPARTMENT */}
            <div className="col-md-4">
              <label className="text-muted small mb-1">Department</label>

              <div className="fw-semibold">
                {consultation.department_name || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CLINICAL INFORMATION */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-semibold">
            <i className="bi bi-file-medical text-primary me-2"></i>
            Clinical Information
          </h5>
        </div>

        <div className="card-body">
          <div className="row g-4">
            {/* SYMPTOMS */}
            <div className="col-md-4">
              <label className="text-muted small mb-1">Symptoms</label>

              <div className="fw-semibold">{consultation.symptoms || "-"}</div>
            </div>

            {/* DIAGNOSIS */}
            <div className="col-md-4">
              <label className="text-muted small mb-1">Diagnosis</label>

              <div className="fw-semibold">{consultation.diagnosis || "-"}</div>
            </div>

            {/* NOTES */}
            <div className="col-md-4">
              <label className="text-muted small mb-1">Notes</label>

              <div className="fw-semibold">{consultation.notes || "-"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* MEDICINES */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-semibold">
            <i className="bi bi-capsule text-primary me-2"></i>
            Medicines
          </h5>
        </div>

        <div className="card-body">
          {consultation.medicine_prescriptions?.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Medicine</th>
                    <th>Strength</th>
                    <th>Dosage Form</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                    <th>Instructions</th>
                  </tr>
                </thead>

                <tbody>
                  {consultation.medicine_prescriptions.map((medicine) => (
                    <tr key={medicine.id}>
                      {/* Medicine */}
                      <td className="fw-semibold">
                        {medicine.medicine_name || "-"}
                        {!medicine.medicine && (
                          <div className="small text-warning-emphasis mt-1">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            Not available in hospital pharmacy
                          </div>
                        )}
                      </td>

                      {/* Strength */}
                      <td>
                        {medicine.medicine_strength
                          ? `${medicine.medicine_strength}${
                              medicine.medicine_strength_unit
                                ? ` ${medicine.medicine_strength_unit}`
                                : ""
                            }`
                          : "-"}
                      </td>

                      {/* Dosage Form */}
                      <td>{medicine.medicine_dosage_form || "-"}</td>

                      {/* Frequency */}
                      <td>
                        {(() => {
                          const frequency = frequencyOptions.find(
                            (option) => option.value === medicine.frequency,
                          );

                          return frequency ? (
                            <>
                              <div className="fw-semibold">
                                {frequency.label}
                              </div>
                              <div className="small text-muted">
                                {frequency.timing}
                              </div>
                            </>
                          ) : (
                            medicine.frequency || "-"
                          );
                        })()}
                      </td>

                      {/* Duration */}
                      <td>
                        {medicine.duration ? (
                          <>
                            <span className="fw-semibold">
                              {medicine.duration}
                            </span>{" "}
                            <span className="text-muted">
                              {medicine.duration_unit === "DAYS"
                                ? "Days"
                                : medicine.duration_unit === "WEEKS"
                                  ? "Weeks"
                                  : medicine.duration_unit === "MONTHS"
                                    ? "Months"
                                    : medicine.duration_unit || ""}
                            </span>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* Instructions */}
                      <td>{medicine.instructions || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              <i className="bi bi-capsule fs-3 d-block mb-2"></i>
              No medicines prescribed.
            </div>
          )}
        </div>
      </div>

      {/* LAB ORDERS */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-semibold">
            <i className="bi bi-eyedropper text-primary me-2"></i>
            Lab Orders
          </h5>
        </div>

        <div className="card-body">
          {consultation.lab_orders?.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Lab Test</th>
                    <th>Instructions</th>
                  </tr>
                </thead>

                <tbody>
                  {consultation.lab_orders.map((lab) => (
                    <tr key={lab.id}>
                      <td className="fw-semibold">
                        {lab.lab_test_name || "-"}
                        {!lab.lab_test && (
                          <div className="small text-warning-emphasis mt-1">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            Not available in hospital lab
                          </div>
                        )}
                      </td>

                      <td>{lab.instructions || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              <i className="bi bi-eyedropper fs-3 d-block mb-2"></i>
              No lab orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConsultationDetails;
