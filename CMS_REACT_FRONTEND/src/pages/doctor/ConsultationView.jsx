import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAppointment,
  getConsultationByAppointment,
} from "../../services/doctorService";

function ConsultationView() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [consultation, setConsultation] = useState(null);
  const [appointment, setAppointment] = useState(null);

  const fetchConsultation = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getConsultationByAppointment(appointmentId);

      console.log("Consultation response:", response.data);

      setConsultation(response.data);

      return response.data;
    } catch (error) {
      console.error("Error loading consultation:", error);

      if (error.response?.status === 404) {
        setError("Consultation not found for this appointment.");
      } else {
        setError("Failed to load consultation.");
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointment = async (appointmentId) => {
    try {
      const response = await getAppointment(appointmentId);

      console.log("Appointment response:", response.data);

      setAppointment(response.data);
    } catch (error) {
      console.error("Error loading appointment:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const consultationData = await fetchConsultation();

      if (consultationData?.appointment) {
        await fetchAppointment(consultationData.appointment);
      }
    };

    loadData();
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>

            <p className="text-muted mt-3 mb-0">Loading consultation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-semibold mb-1">Consultation</h3>

            <p className="text-muted mb-0">View patient consultation details</p>
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/doctor/appointments")}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Appointments
          </button>
        </div>

        <div className="alert alert-danger">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-semibold mb-1">Consultation</h3>

          <p className="text-muted mb-0">View patient consultation details</p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/doctor/appointments")}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Appointments
        </button>
      </div>

      {/* =================================================
          PATIENT INFORMATION
      ================================================= */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0 fw-semibold">
            <i className="bi bi-person-circle me-2 text-primary"></i>
            Patient Information
          </h5>
        </div>

        <div className="card-body">
          <div className="row">
            {/* PATIENT ID */}
            <div className="col-md-4 mb-4">
              <label className="text-muted small">Patient ID</label>
              <div className="fw-semibold">
                {consultation?.patient_id || "-"}
              </div>
            </div>

            {/* PATIENT NAME */}
            <div className="col-md-4 mb-4">
              <label className="text-muted small">Patient Name</label>
              <div className="fw-semibold">
                {consultation?.patient_name || "-"}
              </div>
            </div>

            {/* TOKEN NUMBER */}
            <div className="col-md-4 mb-4">
              <label className="text-muted small d-block">Token Number</label>

              <span className="badge bg-secondary px-3 py-2 fs-6">
                {appointment?.token_number || "-"}
              </span>
            </div>

            {/* AGE */}
            <div className="col-md-4 mb-4">
              <label className="text-muted small">Age</label>
              <div className="fw-semibold">
                {appointment?.patient_age || "-"}
              </div>
            </div>

            {/* GENDER */}
            <div className="col-md-4 mb-4">
              <label className="text-muted small">Gender</label>
              <div className="fw-semibold">
                {appointment?.patient_gender || "-"}
              </div>
            </div>

            {/* BLOOD GROUP */}
            <div className="col-md-4 mb-4">
              <label className="text-muted small">Blood Group</label>
              <div className="fw-semibold">
                {appointment?.patient_blood_group || "-"}
              </div>
            </div>

            {/* PLACE */}
            <div className="col-md-4 mb-4">
              <label className="text-muted small">Place</label>
              <div className="fw-semibold">
                {appointment?.patient_place || "-"}
              </div>
            </div>

            {/* MOBILE NUMBER */}
            <div className="col-md-4 mb-4">
              <label className="text-muted small">Mobile Number</label>
              <div className="fw-semibold">
                {appointment?.patient_mobile || "-"}
              </div>
            </div>

            {/* EMAIL */}
            <div className="col-md-4 mb-4">
              <label className="text-muted small">Email</label>
              <div className="fw-semibold">
                {appointment?.patient_email || "-"}
              </div>
            </div>

            {/* APPOINTMENT DATE */}
            <div className="col-md-4 mb-4">
              <label className="text-muted small">Appointment Date</label>
              <div className="fw-semibold">
                {appointment?.appointment_date || "-"}
              </div>
            </div>

            {/* APPOINTMENT TIME */}
            <div className="col-md-4 mb-4">
              <label className="text-muted small">Appointment Time</label>
              <div className="fw-semibold">
                {appointment?.appointment_time || "-"}
              </div>
            </div>

            {/* APPOINTMENT TYPE */}
            <div className="col-md-4 mb-4">
              <label className="text-muted small">Appointment Type</label>

              <div className="fw-semibold">
                {appointment?.appointment_type === "WALK_IN"
                  ? "Walk-in"
                  : appointment?.appointment_type === "BOOKING"
                    ? "Booking"
                    : "-"}
              </div>
            </div>

            {/* CONSULTATION DATE */}
            <div className="col-md-4 mb-3">
              <label className="text-muted small">Consultation Date</label>

              <div className="fw-semibold">
                {consultation?.consultation_date
                  ? new Date(
                      consultation.consultation_date,
                    ).toLocaleDateString()
                  : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          CONSULTATION DETAILS
      ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0 fw-semibold">
            <i className="bi bi-clipboard2-pulse me-2 text-warning"></i>
            Consultation Details
          </h5>
        </div>

        <div className="card-body">
          {/* SYMPTOMS */}

          <div className="mb-4">
            <label className="form-label fw-semibold">Symptoms</label>

            <div className="border rounded p-3 bg-light">
              {consultation?.symptoms || "-"}
            </div>
          </div>

          {/* DIAGNOSIS */}

          <div className="mb-4">
            <label className="form-label fw-semibold">Diagnosis</label>

            <div className="border rounded p-3 bg-light">
              {consultation?.diagnosis || "-"}
            </div>
          </div>

          {/* CLINICAL NOTES */}

          <div className="mb-2">
            <label className="form-label fw-semibold">Clinical Notes</label>

            <div className="border rounded p-3 bg-light">
              {consultation?.notes || "-"}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          PRESCRIPTIONS
      ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0 fw-semibold">Prescriptions</h5>
        </div>

        <div className="card-body">
          {/* =================================================
              MEDICINES
          ================================================= */}

          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-prescription2 me-2 text-success-emphasis"></i>
                Medicines
              </h5>
            </div>

            <div className="card-body">
              {consultation?.medicine_prescriptions?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Medicine</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Duration</th>
                        <th>Instructions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {consultation.medicine_prescriptions.map(
                        (medicine, index) => (
                          <tr key={medicine.id || index}>
                            <td>{medicine.medicine_name || "-"}</td>

                            <td>{medicine.dosage || "-"}</td>

                            <td>{medicine.frequency || "-"}</td>

                            <td>{medicine.duration || "-"}</td>

                            <td>{medicine.instructions || "-"}</td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-muted">No medicines prescribed.</div>
              )}
            </div>
          </div>

          {/* =================================================
              LAB ORDERS
          ================================================= */}

          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-clipboard2-pulse me-2 text-info-emphasis"></i>
                Lab Orders
              </h5>
            </div>

            <div className="card-body">
              {consultation?.lab_orders?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Lab Test</th>
                        <th>Instructions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {consultation.lab_orders.map((labOrder, index) => (
                        <tr key={labOrder.id || index}>
                          <td>{labOrder.lab_test_name || "-"}</td>

                          <td>{labOrder.instructions || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-muted">No lab tests ordered.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/doctor/appointments")}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Appointments
        </button>
      </div>
    </div>
  );
}

export default ConsultationView;
