/* eslint-disable react-hooks/set-state-in-effect */
// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createConsultation,
  getAppointment,
  getMedicalHistoryByAppointment,
} from "../../../services/doctorService";
import { getMedicines } from "../../../services/medicineService";
import { getLabTests } from "../../../services/labTestService";
import { frequencyOptions } from "../../../constants/doctor/doctor";

function Consultation() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [showPrescription, setShowPrescription] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [showOtherMedicine, setShowOtherMedicine] = useState(false);
  const [otherMedicineForm, setOtherMedicineForm] = useState({
    medicine_name: "",
    frequency: "",
    duration: "",
    duration_unit: "",
    instructions: "",
  });

  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [medicineErrors, setMedicineErrors] = useState({});
  const [otherMedicineErrors, setOtherMedicineErrors] = useState({});

  const [labTests, setLabTests] = useState([]);
  const [showLabOrder, setShowLabOrder] = useState(false);

  const [labOrderForm, setLabOrderForm] = useState({
    lab_test: "",
    instructions: "",
  });

  const [showOtherLabTest, setShowOtherLabTest] = useState(false);

  const [otherLabTestForm, setOtherLabTestForm] = useState({
    lab_test_name: "",
    instructions: "",
  });

  const [otherLabTestErrors, setOtherLabTestErrors] = useState({});

  const [labOrderErrors, setLabOrderErrors] = useState({});
  const [formData, setFormData] = useState({
    symptoms: "",
    diagnosis: "",
    notes: "",
    medicine_prescriptions: [],
    lab_orders: [],
  });

  const [medicineForm, setMedicineForm] = useState({
    medicine: "",
    dosage: "",
    frequency: "",
    duration: "",
    duration_unit: "",
    instructions: "",
  });

  const [medicalHistory, setMedicalHistory] = useState([]);

  const fetchLabTests = async () => {
    try {
      const response = await getLabTests();
      setLabTests(response.data);
    } catch (error) {
      console.error("Error loading lab tests:", error);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await getMedicines();

      setMedicines(response.data);
    } catch (error) {
      console.error("Error loading medicines:", error);
    }
  };

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      setError("");

      const appointmentResponse = await getAppointment(appointmentId);
      setAppointment(appointmentResponse.data);

      try {
        const consultationResponse =
          await getMedicalHistoryByAppointment(appointmentId);

        setMedicalHistory(consultationResponse.data || []);
      } catch (historyError) {
        // No previous consultation is okay
        if (historyError.response?.status === 404) {
          setMedicalHistory([]);
        } else {
          console.error("Error loading medical history:", historyError);
          setMedicalHistory([]);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading appointment:", error);
      setError("Failed to load appointment.");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name] && value.trim()) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAddMedicine = () => {
    const errors = {};

    if (!medicineForm.medicine) {
      errors.medicine = "Medicine is required.";
    }

    if (!medicineForm.frequency) {
      errors.frequency = "Frequency is required.";
    }

    if (!medicineForm.duration) {
      errors.duration = "Duration is required.";
    } else if (Number(medicineForm.duration) < 1) {
      errors.duration = "Duration must be at least 1.";
    }

    if (!medicineForm.duration_unit) {
      errors.duration_unit = "Duration unit is required.";
    }

    setMedicineErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const newMedicine = {
      medicine: Number(medicineForm.medicine),
      frequency: medicineForm.frequency,
      duration: Number(medicineForm.duration),
      duration_unit: medicineForm.duration_unit,
      instructions: medicineForm.instructions.trim(),
    };

    setFormData((prev) => ({
      ...prev,
      medicine_prescriptions: [...prev.medicine_prescriptions, newMedicine],
    }));

    // Reset form
    setMedicineForm({
      medicine: "",
      frequency: "",
      duration: "",
      duration_unit: "",
      instructions: "",
    });

    setMedicineErrors({});
    setShowPrescription(false);
  };

  const handleMedicineChange = (e) => {
    const medicineId = e.target.value;

    setMedicineForm((prev) => ({
      ...prev,
      medicine: medicineId,
    }));

    if (medicineId) {
      setMedicineErrors((prev) => ({
        ...prev,
        medicine: "",
      }));
    }
  };

  const handleOtherMedicineChange = (e) => {
    const { name, value } = e.target;

    setOtherMedicineForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (otherMedicineErrors[name] && value.trim()) {
      setOtherMedicineErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const handleAddOtherMedicine = () => {
    const errors = {};

    if (!otherMedicineForm.medicine_name.trim()) {
      errors.medicine_name = "Medicine name is required.";
    }

    if (!otherMedicineForm.frequency) {
      errors.frequency = "Frequency is required.";
    }

    if (!otherMedicineForm.duration) {
      errors.duration = "Duration is required.";
    } else if (Number(otherMedicineForm.duration) < 1) {
      errors.duration = "Duration must be at least 1.";
    }

    if (!otherMedicineForm.duration_unit) {
      errors.duration_unit = "Duration unit is required.";
    }

    setOtherMedicineErrors(errors);

    // Stop if validation fails
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Add unavailable medicine to the same array
    setFormData((prev) => ({
      ...prev,
      medicine_prescriptions: [
        ...prev.medicine_prescriptions,
        {
          medicine: null,
          medicine_name: otherMedicineForm.medicine_name.trim(),
          frequency: otherMedicineForm.frequency,
          duration: Number(otherMedicineForm.duration),
          duration_unit: otherMedicineForm.duration_unit,
          instructions: otherMedicineForm.instructions.trim(),
        },
      ],
    }));

    // Reset form
    setOtherMedicineForm({
      medicine_name: "",
      frequency: "",
      duration: "",
      duration_unit: "",
      instructions: "",
    });

    setOtherMedicineErrors({});

    // Close form
    setShowOtherMedicine(false);
  };

  // ADDED
  const handleLabTestChange = (e) => {
    const { value } = e.target;

    setLabOrderForm((prev) => ({
      ...prev,
      lab_test: value,
    }));

    if (labOrderErrors.lab_test && value) {
      setLabOrderErrors((prev) => ({
        ...prev,
        lab_test: "",
      }));
    }
  };

  // ADDED
  const handleAddLabTest = () => {
    const errors = {};

    if (!labOrderForm.lab_test) {
      errors.lab_test = "Lab test is required.";
    }

    if (Object.keys(errors).length > 0) {
      setLabOrderErrors(errors);
      return;
    }

    const newLabOrder = {
      lab_test: Number(labOrderForm.lab_test),
      instructions: labOrderForm.instructions,
    };

    setFormData((prev) => ({
      ...prev,
      lab_orders: [...prev.lab_orders, newLabOrder],
    }));

    setLabOrderForm({
      lab_test: "",
      instructions: "",
    });

    setLabOrderErrors({});
    setShowLabOrder(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!formData.symptoms.trim()) {
      errors.symptoms = "Symptoms are required.";
    }

    if (!formData.diagnosis.trim()) {
      errors.diagnosis = "Diagnosis is required.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    try {
      setSaving(true);
      setError("");

      const consultationData = {
        appointment: appointmentId,
        symptoms: formData.symptoms,
        diagnosis: formData.diagnosis,
        notes: formData.notes, // CHANGED: clinical_notes → notes
        medicine_prescriptions: formData.medicine_prescriptions,
        lab_orders: formData.lab_orders,
      };

      console.log("Consultation data:", consultationData);

      await createConsultation(consultationData);

      // Navigate only after successful API call
      navigate("/doctor/appointments");
    } catch (error) {
      console.error("Error saving consultation:", error);
      setError("Failed to save consultation.");
    } finally {
      setSaving(false); // ADDED
    }
  };

  useEffect(() => {
    fetchAppointment();
    fetchMedicines();
    fetchLabTests();
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

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-semibold mb-1 text-primary-emphasis">
            Consultation
          </h3>

          <p className="text-muted mb-0">Record patient consultation details</p>
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

      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-circle me-2"></i>

          {error}
        </div>
      )}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0 fw-semibold text-primary-emphasis">
            <i className="bi bi-person-circle me-2"></i>
            Patient Information
          </h5>
        </div>

        <div className="card-body">
          <div className="row">
            {/* PATIENT ID */}

            <div className="col-md-4 mb-3">
              <label className="text-muted small">Patient ID</label>

              <div className="fw-semibold">
                {appointment?.patient_id || "-"}
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <label className="text-muted small">Patient Name</label>

              <div className="fw-semibold">
                {appointment?.patient_name || "-"}
              </div>
            </div>

            {/* TOKEN */}
            <div className="col-md-4 mb-3">
              <label className="text-muted small d-block">Token Number</label>

              <span className="badge bg-secondary px-3 py-2 fs-6">
                {appointment?.token_number || "-"}
              </span>
            </div>
            {/* PATIENT AGE */}
            <div className="col-md-4 mb-3">
              <label className="text-muted small">Age</label>
              <div className="fw-semibold">
                {appointment?.patient_age || "-"}
              </div>
            </div>
            {/* GENDER */}
            <div className="col-md-4 mb-3">
              <label className="text-muted small">Gender</label>
              <div className="fw-semibold">
                {appointment?.patient_gender || "-"}
              </div>
            </div>
            {/* BLOOD GROUP */}
            <div className="col-md-4 mb-3">
              <label className="text-muted small">Blood Group</label>
              <div className="fw-semibold">
                {appointment?.patient_blood_group || "-"}
              </div>
            </div>
            {/* PLACE */}
            <div className="col-md-4 mb-3">
              <label className="text-muted small">Place</label>
              <div className="fw-semibold">
                {appointment?.patient_place || "-"}
              </div>
            </div>

            {/* MOBILE */}
            <div className="col-md-4 mb-3">
              <label className="text-muted small">Mobile Number</label>
              <div className="fw-semibold">
                {appointment?.patient_mobile || "-"}
              </div>
            </div>

            {/* EMAIL */}
            <div className="col-md-4 mb-3">
              <label className="text-muted small">Email</label>
              <div className="fw-semibold">
                {appointment?.patient_email || "-"}
              </div>
            </div>

            {/* DATE */}

            <div className="col-md-4 mb-3">
              <label className="text-muted small">Appointment Date</label>

              <div className="fw-semibold">
                {appointment?.appointment_date || "-"}
              </div>
            </div>

            {/* TIME */}

            <div className="col-md-4">
              <label className="text-muted small">Appointment Time</label>

              <div className="fw-semibold">
                {appointment?.appointment_time || "-"}
              </div>
            </div>

            {/* TYPE */}

            <div className="col-md-4">
              <label className="text-muted small">Appointment Type</label>

              <div className="fw-semibold">
                {appointment?.appointment_type === "WALK_IN"
                  ? "Walk-in"
                  : "Booking"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}
      {/* ==================== MEDICAL HISTORY ==================== */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0 fw-semibold">
            <i className="bi bi-clock-history me-2 fs-4 text-info"></i>
            <span className="text-primary-emphasis">Medical History</span>
          </h5>
        </div>

        <div className="card-body">
          {medicalHistory.length === 0 ? (
            /* ==================== NO MEDICAL HISTORY ==================== */

            <div className="text-center text-muted py-4">
              <i className="bi bi-clock-history fs-2 d-block mb-2"></i>

              <div className="fw-semibold">No medical history available.</div>
            </div>
          ) : (
            /* ==================== MEDICAL HISTORY ACCORDION ==================== */

            <div className="accordion" id="medicalHistoryAccordion">
              {medicalHistory.map((history, index) => (
                <div
                  className="accordion-item mb-3 border rounded overflow-hidden"
                  key={history.id}
                >
                  {/* ==================== ACCORDION HEADER ==================== */}

                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${
                        index !== 0 ? "collapsed" : ""
                      }`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#medicalHistory-${history.id}`}
                      aria-expanded={index === 0}
                      aria-controls={`medicalHistory-${history.id}`}
                    >
                      <div className="w-100">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                          {/* LEFT SIDE */}

                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <i className="bi bi-calendar2-check-fill fs-4 text-primary-emphasis"></i>
                            </div>

                            <div>
                              <div className="fw-semibold text-dark">
                                Previous Consultation
                              </div>

                              <div className="small text-muted">
                                {history.consultation_date
                                  ? new Date(
                                      history.consultation_date,
                                    ).toLocaleDateString()
                                  : "-"}
                              </div>
                            </div>
                          </div>

                          {/* RIGHT SIDE */}

                          <div className="d-flex align-items-center gap-2 me-3 flex-wrap">
                            {history.doctor_name && (
                              <span className="badge bg-primary-subtle text-primary-emphasis px-3 py-2">
                                <i className="bi bi-person-badge me-1"></i>
                                Dr. {history.doctor_name}
                              </span>
                            )}

                            {history.department_name && (
                              <span className="badge bg-secondary-subtle text-secondary px-3 py-2">
                                <i className="bi bi-hospital me-1"></i>
                                {history.department_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  </h2>

                  {/* ==================== ACCORDION BODY ==================== */}

                  <div
                    id={`medicalHistory-${history.id}`}
                    className={`accordion-collapse collapse ${
                      index === 0 ? "show" : ""
                    }`}
                    data-bs-parent="#medicalHistoryAccordion"
                  >
                    <div className="accordion-body">
                      {/* ==================== DOCTOR & DEPARTMENT ==================== */}

                      <div className="row g-3 mb-4">
                        {/* DOCTOR */}

                        {history.doctor_name && (
                          <div className="col-md-6">
                            <div className="p-3 rounded border bg-light">
                              <div className="d-flex align-items-center">
                                <div className="me-3">
                                  <i className="bi bi-person-badge-fill fs-4 text-primary-emphasis"></i>
                                </div>

                                <div>
                                  <div className="text-muted small fw-semibold">
                                    DOCTOR
                                  </div>

                                  <div className="fw-bold text-dark">
                                    {history.doctor_name}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* DEPARTMENT */}

                        {history.department_name && (
                          <div className="col-md-6">
                            <div className="p-3 rounded border bg-light">
                              <div className="d-flex align-items-center">
                                <div className="me-3">
                                  <i className="bi bi-hospital-fill fs-4 text-primary-emphasis"></i>
                                </div>

                                <div>
                                  <div className="text-muted small fw-semibold">
                                    DEPARTMENT
                                  </div>

                                  <div className="fw-bold text-dark">
                                    {history.department_name}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ==================== CONSULTATION DATE ==================== */}

                      <div className="mb-4">
                        <label className="text-muted small fw-semibold">
                          Consultation Date
                        </label>

                        <div className="fw-semibold mt-1">
                          {history.consultation_date
                            ? new Date(
                                history.consultation_date,
                              ).toLocaleDateString()
                            : "-"}
                        </div>
                      </div>

                      {/* ==================== SYMPTOMS & DIAGNOSIS ==================== */}

                      <div className="row">
                        {/* SYMPTOMS */}

                        <div className="col-md-6 mb-3">
                          <label className="text-muted small fw-semibold">
                            Symptoms
                          </label>

                          <div className="mt-1">{history.symptoms || "-"}</div>
                        </div>

                        {/* DIAGNOSIS */}

                        <div className="col-md-6 mb-3">
                          <label className="text-muted small fw-semibold">
                            Diagnosis
                          </label>

                          <div className="mt-1">{history.diagnosis || "-"}</div>
                        </div>
                      </div>

                      {/* ==================== NOTES ==================== */}

                      <div className="mb-4">
                        <label className="text-muted small fw-semibold">
                          Notes
                        </label>

                        <div className="mt-1">{history.notes || "-"}</div>
                      </div>

                      {/* =====================================================
                    MEDICINES
                ====================================================== */}

                      <div className="mt-4">
                        <h6 className="fw-semibold mb-3">
                          <i className="bi bi-prescription2 me-2 text-success"></i>
                          Medicines
                        </h6>

                        {!history.medicine_prescriptions ||
                        history.medicine_prescriptions.length === 0 ? (
                          <div className="text-muted small">
                            No medicines prescribed.
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-bordered table-sm align-middle mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th>Medicine</th>
                                  <th>Strength</th>
                                  {/* <th>Dosage Form</th> */}
                                  <th>Frequency</th>
                                  <th>Duration</th>
                                  {/* <th>Quantity</th> */}
                                  <th>Instructions</th>
                                </tr>
                              </thead>

                              <tbody>
                                {history.medicine_prescriptions.map(
                                  (medicine) => (
                                    <tr key={medicine.id}>
                                      {/* MEDICINE */}

                                      <td className="fw-semibold">
                                        {medicine.medicine_name || "-"}
                                      </td>

                                      {/* STRENGTH */}

                                      <td>
                                        {medicine.medicine_strength
                                          ? `${medicine.medicine_strength} ${
                                              medicine.medicine_strength_unit ||
                                              ""
                                            }`
                                          : "-"}
                                      </td>

                                      {/* DOSAGE FORM */}

                                      {/* <td>
                                        {medicine.medicine_dosage_form || "-"}
                                      </td> */}

                                      {/* FREQUENCY */}

                                      <td>{medicine.frequency || "-"}</td>

                                      {/* DURATION */}

                                      <td>
                                        {medicine.duration
                                          ? `${medicine.duration} ${
                                              medicine.duration_unit || ""
                                            }`
                                          : "-"}
                                      </td>

                                      {/* QUANTITY */}

                                      {/* <td className="fw-semibold">
                                        {medicine.quantity ?? "-"}
                                      </td> */}

                                      {/* INSTRUCTIONS */}

                                      <td>{medicine.instructions || "-"}</td>
                                    </tr>
                                  ),
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* =====================================================
                    LAB ORDERS
                ====================================================== */}

                      <div className="mt-4">
                        <h6 className="fw-semibold mb-3">
                          <i className="bi bi-clipboard2-plus me-2 text-info"></i>
                          Lab Orders
                        </h6>

                        {!history.lab_orders ||
                        history.lab_orders.length === 0 ? (
                          <div className="text-muted small">
                            No lab tests ordered.
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-bordered table-sm align-middle mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th>Lab Test</th>
                                  <th>Instructions</th>
                                </tr>
                              </thead>

                              <tbody>
                                {history.lab_orders.map((lab) => (
                                  <tr key={lab.id}>
                                    <td className="fw-semibold">
                                      {lab.lab_test_name || "-"}
                                    </td>

                                    <td>{lab.instructions || "-"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==================== END MEDICAL HISTORY ==================== */}
      {/* =================================================
          CONSULTATION FORM
      ================================================= */}

      <form onSubmit={handleSubmit}>
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0 fw-semibold">
              <i className="fs-4 bi bi-clipboard2-pulse me-2 text-warning"></i>
              <span className="text-primary-emphasis">
                Consultation Details
              </span>
            </h5>
          </div>

          <div className="card-body">
            <div className="row">
              {/* SYMPTOMS */}

              <div className="col-md-6 mb-4">
                <label className="form-label fw-semibold">
                  Symptoms <span className="text-danger">*</span>
                </label>

                <textarea
                  name="symptoms"
                  className={`form-control ${
                    validationErrors.symptoms ? "is-invalid" : ""
                  }`}
                  rows="4"
                  placeholder="Enter patient symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                ></textarea>

                {validationErrors.symptoms && (
                  <div className="invalid-feedback">
                    {validationErrors.symptoms}
                  </div>
                )}
              </div>

              {/* DIAGNOSIS */}

              <div className="col-md-6 mb-4">
                <label className="form-label fw-semibold">
                  Diagnosis <span className="text-danger">*</span>
                </label>

                <textarea
                  name="diagnosis"
                  className={`form-control ${
                    validationErrors.diagnosis ? "is-invalid" : ""
                  }`}
                  rows="4"
                  placeholder="Enter diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                ></textarea>

                {validationErrors.diagnosis && (
                  <div className="invalid-feedback">
                    {validationErrors.diagnosis}
                  </div>
                )}
              </div>

              {/* CLINICAL NOTES */}

              <div className="col-12 mb-4">
                <label className="form-label fw-semibold">Clinical Notes</label>

                <textarea
                  name="notes"
                  className="form-control"
                  rows="5"
                  placeholder="Enter consultation notes"
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        {/* PRESCRIPTIONS */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0 fw-semibold">
              <span className="text-primary-emphasis">Prescriptions</span>
            </h5>
          </div>

          <div className="card-body">
            {/* =================================================
        MEDICINE
    ================================================= */}
            {/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}
            <div className="card mb-4 border-0 shadow-sm">
              {/*MEDICINE HEADER*/}
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <i className="fs-4 bi bi-prescription2 me-2 text-success-emphasis"></i>

                  <span className="text-primary-emphasis">Medicine</span>
                </h5>
              </div>

              <div className="card-body">
                {/* =====================================================
        INITIAL BUTTONS
    ====================================================== */}

                {!showPrescription && !showOtherMedicine && (
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setShowPrescription(true)}
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      Add Medicine
                    </button>

                    <div className="mt-3">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setShowOtherMedicine(true)}
                      >
                        <i className="bi bi-plus-circle me-1"></i>
                        Add medicine not available in pharmacy
                      </button>
                    </div>
                  </div>
                )}

                {/* =====================================================
        MEDICINE NOT AVAILABLE IN PHARMACY
    ====================================================== */}

                {showOtherMedicine && (
                  <div className="border rounded p-3 mt-3 bg-light">
                    <h6 className="fw-semibold mb-3">
                      <i className="bi bi-capsule me-2 text-primary"></i>
                      Add Medicine Not Available in Pharmacy
                    </h6>

                    {/* Medicine Name */}

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Medicine Name
                        <span className="text-danger ms-1">*</span>
                      </label>

                      <input
                        type="text"
                        name="medicine_name"
                        className={`form-control ${
                          otherMedicineErrors.medicine_name ? "is-invalid" : ""
                        }`}
                        value={otherMedicineForm.medicine_name}
                        onChange={handleOtherMedicineChange}
                        placeholder="Enter medicine name"
                      />

                      {otherMedicineErrors.medicine_name && (
                        <div className="invalid-feedback">
                          {otherMedicineErrors.medicine_name}
                        </div>
                      )}
                    </div>

                    {/* =================================================
            FREQUENCY / DURATION / UNIT
        ================================================== */}

                    <div className="row">
                      {/* Frequency */}

                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">
                          Frequency
                          <span className="text-danger ms-1">*</span>
                        </label>

                        <select
                          name="frequency"
                          className={`form-select ${
                            otherMedicineErrors.frequency ? "is-invalid" : ""
                          }`}
                          value={otherMedicineForm.frequency}
                          onChange={handleOtherMedicineChange}
                        >
                          <option value="">Select Frequency</option>

                          {frequencyOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label} — {option.timing}
                            </option>
                          ))}
                        </select>

                        {otherMedicineErrors.frequency && (
                          <div className="invalid-feedback">
                            {otherMedicineErrors.frequency}
                          </div>
                        )}
                      </div>

                      {/* Duration */}

                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">
                          Duration
                          <span className="text-danger ms-1">*</span>
                        </label>

                        <input
                          type="number"
                          min="1"
                          name="duration"
                          className={`form-control ${
                            otherMedicineErrors.duration ? "is-invalid" : ""
                          }`}
                          value={otherMedicineForm.duration}
                          onChange={handleOtherMedicineChange}
                          placeholder="e.g. 5"
                        />

                        {otherMedicineErrors.duration && (
                          <div className="invalid-feedback">
                            {otherMedicineErrors.duration}
                          </div>
                        )}
                      </div>

                      {/* Duration Unit */}

                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">
                          Duration Unit
                          <span className="text-danger ms-1">*</span>
                        </label>

                        <select
                          name="duration_unit"
                          className={`form-select ${
                            otherMedicineErrors.duration_unit
                              ? "is-invalid"
                              : ""
                          }`}
                          value={otherMedicineForm.duration_unit}
                          onChange={handleOtherMedicineChange}
                        >
                          <option value="">Select Unit</option>

                          <option value="DAYS">Days</option>

                          <option value="WEEKS">Weeks</option>

                          <option value="MONTHS">Months</option>
                        </select>

                        {otherMedicineErrors.duration_unit && (
                          <div className="invalid-feedback">
                            {otherMedicineErrors.duration_unit}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* =================================================
            INSTRUCTIONS
        ================================================== */}

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Instructions
                      </label>

                      <textarea
                        name="instructions"
                        className="form-control"
                        rows="3"
                        value={otherMedicineForm.instructions}
                        onChange={handleOtherMedicineChange}
                        placeholder="e.g. Take after food"
                      />
                    </div>

                    {/* =================================================
            BUTTONS
        ================================================== */}

                    <button
                      type="button"
                      className="btn btn-primary me-2"
                      onClick={handleAddOtherMedicine}
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      Add Medicine
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowOtherMedicine(false);

                        setOtherMedicineErrors({});
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* =====================================================
        PHARMACY AVAILABLE MEDICINE
    ====================================================== */}

                {showPrescription && (
                  <div className="border rounded p-3 mt-3 bg-light">
                    <h6 className="fw-semibold mb-3">
                      <i className="bi bi-capsule me-2 text-primary"></i>
                      Add Medicine
                    </h6>

                    {/* =================================================
            MEDICINE SELECT
        ================================================== */}

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Medicine
                        <span className="text-danger ms-1">*</span>
                      </label>

                      <select
                        className={`form-select ${
                          medicineErrors.medicine ? "is-invalid" : ""
                        }`}
                        value={medicineForm.medicine}
                        onChange={handleMedicineChange}
                      >
                        <option value="">Select Medicine</option>

                        {medicines
                          .filter((medicine) => medicine.is_active)
                          .map((medicine) => (
                            <option key={medicine.id} value={medicine.id}>
                              {medicine.name}

                              {medicine.strength && (
                                <>
                                  {" - "}
                                  {medicine.strength}

                                  {medicine.strength_unit
                                    ? ` ${medicine.strength_unit}`
                                    : ""}
                                </>
                              )}
                            </option>
                          ))}
                      </select>

                      {medicineErrors.medicine && (
                        <div className="invalid-feedback">
                          {medicineErrors.medicine}
                        </div>
                      )}
                    </div>

                    {/* =================================================
            MEDICINE MASTER INFORMATION
        ================================================== */}

                    {medicineForm.medicine &&
                      (() => {
                        const selectedMedicine = medicines.find(
                          (medicine) =>
                            medicine.id === Number(medicineForm.medicine),
                        );

                        if (!selectedMedicine) {
                          return null;
                        }

                        return (
                          <div className="row g-3 mb-4">
                            {/* Strength */}

                            <div className="col-md-4">
                              <label className="form-label fw-semibold">
                                Strength
                              </label>

                              <input
                                type="text"
                                className="form-control bg-white"
                                value={selectedMedicine.strength || "-"}
                                readOnly
                              />
                            </div>

                            {/* Strength Unit */}

                            <div className="col-md-4">
                              <label className="form-label fw-semibold">
                                Strength Unit
                              </label>

                              <input
                                type="text"
                                className="form-control bg-white"
                                value={selectedMedicine.strength_unit || "-"}
                                readOnly
                              />
                            </div>

                            {/* Dosage Form */}

                            <div className="col-md-4">
                              <label className="form-label fw-semibold">
                                Dosage Form
                              </label>

                              <input
                                type="text"
                                className="form-control bg-white"
                                value={selectedMedicine.dosage_form || "-"}
                                readOnly
                              />
                            </div>
                          </div>
                        );
                      })()}

                    {/* =================================================
            FREQUENCY / DURATION / UNIT
        ================================================== */}

                    <div className="row">
                      {/* Frequency */}

                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">
                          Frequency
                          <span className="text-danger ms-1">*</span>
                        </label>

                        <select
                          className={`form-select ${
                            medicineErrors.frequency ? "is-invalid" : ""
                          }`}
                          value={medicineForm.frequency}
                          onChange={(e) => {
                            const value = e.target.value;

                            setMedicineForm((prev) => ({
                              ...prev,
                              frequency: value,
                            }));

                            if (value) {
                              setMedicineErrors((prev) => ({
                                ...prev,
                                frequency: "",
                              }));
                            }
                          }}
                        >
                          <option value="">Select Frequency</option>

                          {frequencyOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label} — {option.timing}
                            </option>
                          ))}
                        </select>

                        {medicineErrors.frequency && (
                          <div className="invalid-feedback">
                            {medicineErrors.frequency}
                          </div>
                        )}
                      </div>

                      {/* Duration */}

                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">
                          Duration
                          <span className="text-danger ms-1">*</span>
                        </label>

                        <input
                          type="number"
                          min="1"
                          className={`form-control ${
                            medicineErrors.duration ? "is-invalid" : ""
                          }`}
                          placeholder="e.g. 5"
                          value={medicineForm.duration}
                          onChange={(e) => {
                            const value = e.target.value;

                            setMedicineForm((prev) => ({
                              ...prev,
                              duration: value,
                            }));

                            if (value) {
                              setMedicineErrors((prev) => ({
                                ...prev,
                                duration: "",
                              }));
                            }
                          }}
                        />

                        {medicineErrors.duration && (
                          <div className="invalid-feedback">
                            {medicineErrors.duration}
                          </div>
                        )}
                      </div>

                      {/* Duration Unit */}

                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">
                          Duration Unit
                          <span className="text-danger ms-1">*</span>
                        </label>

                        <select
                          className={`form-select ${
                            medicineErrors.duration_unit ? "is-invalid" : ""
                          }`}
                          value={medicineForm.duration_unit}
                          onChange={(e) => {
                            const value = e.target.value;

                            setMedicineForm((prev) => ({
                              ...prev,
                              duration_unit: value,
                            }));

                            if (value) {
                              setMedicineErrors((prev) => ({
                                ...prev,
                                duration_unit: "",
                              }));
                            }
                          }}
                        >
                          <option value="">Select Unit</option>

                          <option value="DAYS">Days</option>

                          <option value="WEEKS">Weeks</option>

                          <option value="MONTHS">Months</option>
                        </select>

                        {medicineErrors.duration_unit && (
                          <div className="invalid-feedback">
                            {medicineErrors.duration_unit}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* =================================================
            INSTRUCTIONS
        ================================================== */}

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Instructions
                      </label>

                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="e.g. Take after food"
                        value={medicineForm.instructions}
                        onChange={(e) =>
                          setMedicineForm((prev) => ({
                            ...prev,
                            instructions: e.target.value,
                          }))
                        }
                      ></textarea>
                    </div>

                    {/* =================================================
            BUTTONS
        ================================================== */}

                    <button
                      type="button"
                      className="btn btn-primary me-2"
                      onClick={handleAddMedicine}
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      Add Medicine
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowPrescription(false);

                        setMedicineErrors({});
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* =====================================================
        ADDED MEDICINES
    ====================================================== */}

                {formData.medicine_prescriptions.length > 0 && (
                  <div className="table-responsive mt-4">
                    <h6 className="fw-semibold mb-3">
                      <i className="bi bi-list-check me-2 text-success"></i>
                      Added Medicines
                    </h6>

                    <table className="table table-bordered align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Medicine</th>

                          <th>Strength</th>

                          <th>Dosage Form</th>

                          <th>Frequency</th>

                          <th>Duration</th>

                          {/* <th>Quantity</th> */}

                          <th className="text-center">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {formData.medicine_prescriptions.map(
                          (medicine, index) => {
                            const selectedMedicine = medicine.medicine
                              ? medicines.find(
                                  (item) =>
                                    item.id === Number(medicine.medicine),
                                )
                              : null;

                            const frequency = frequencyOptions.find(
                              (option) => option.value === medicine.frequency,
                            );

                            return (
                              <tr key={index}>
                                {/* Medicine */}

                                <td className="fw-semibold">
                                  {medicine.medicine
                                    ? selectedMedicine?.name ||
                                      "Unknown Medicine"
                                    : medicine.medicine_name || "-"}
                                </td>

                                {/* Strength */}

                                <td>
                                  {medicine.medicine &&
                                  selectedMedicine?.strength
                                    ? `${selectedMedicine.strength}${
                                        selectedMedicine.strength_unit
                                          ? ` ${selectedMedicine.strength_unit}`
                                          : ""
                                      }`
                                    : "-"}
                                </td>

                                {/* Dosage Form */}

                                <td>
                                  {medicine.medicine
                                    ? selectedMedicine?.dosage_form || "-"
                                    : "-"}
                                </td>

                                {/* Frequency */}

                                <td>
                                  {frequency ? (
                                    <>
                                      <div className="fw-semibold">
                                        {frequency.label}
                                      </div>

                                      <div className="small text-muted">
                                        {frequency.timing}
                                      </div>
                                    </>
                                  ) : (
                                    "-"
                                  )}
                                </td>

                                {/* Duration */}

                                <td>
                                  {medicine.duration
                                    ? `${medicine.duration} ${
                                        medicine.duration_unit || ""
                                      }`
                                    : "-"}
                                </td>

                                {/* Quantity */}

                                {/* <td className="fw-semibold">
                                  {medicine.quantity ?? "-"}
                                </td> */}

                                {/* Delete */}

                                <td className="text-center">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => {
                                      setFormData((prev) => ({
                                        ...prev,

                                        medicine_prescriptions:
                                          prev.medicine_prescriptions.filter(
                                            (_, i) => i !== index,
                                          ),
                                      }));
                                    }}
                                    title="Remove medicine"
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          },
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* LAB ORDERS */}
            <div className="card mb-4">
              {/* Lab Header */}
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fs-4 bi bi-clipboard2-plus me-2 text-info"></i>
                  <span className="text-primary-emphasis">Lab Orders</span>
                </h5>
              </div>

              <div className="card-body">
                {/* =================================================
            INITIAL LAB BUTTONS
        ================================================= */}

                {!showLabOrder && !showOtherLabTest && (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setShowLabOrder(true)}
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      Add Lab Test
                    </button>

                    <div className="mt-3">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setShowOtherLabTest(true)}
                      >
                        <i className="bi bi-plus-circle me-1"></i>
                        Add lab test not available in lab
                      </button>
                    </div>
                  </>
                )}

                {/* =================================================
            AVAILABLE LAB TEST FORM
        ================================================= */}

                {showLabOrder && (
                  <div className="border rounded p-3 mt-3">
                    <h6 className="mb-3">Add Lab Test</h6>

                    {/* Lab Test */}
                    <div className="mb-3">
                      <label className="form-label">
                        Lab Test <span className="text-danger">*</span>
                      </label>

                      <select
                        className={`form-select ${
                          labOrderErrors.lab_test ? "is-invalid" : ""
                        }`}
                        value={labOrderForm.lab_test}
                        onChange={handleLabTestChange}
                      >
                        <option value="">Select Lab Test</option>

                        {labTests
                          .filter((test) => test.is_active)
                          .map((test) => (
                            <option key={test.id} value={test.id}>
                              {test.name}
                            </option>
                          ))}
                      </select>

                      {labOrderErrors.lab_test && (
                        <div className="invalid-feedback">
                          {labOrderErrors.lab_test}
                        </div>
                      )}
                    </div>

                    {/* Instructions */}
                    <div className="mb-3">
                      <label className="form-label">Instructions</label>

                      <textarea
                        className="form-control"
                        rows="3"
                        value={labOrderForm.instructions}
                        onChange={(e) =>
                          setLabOrderForm((prev) => ({
                            ...prev,
                            instructions: e.target.value,
                          }))
                        }
                        placeholder="Enter instructions"
                      />
                    </div>

                    {/* Buttons */}
                    <button
                      type="button"
                      className="btn btn-primary me-2"
                      onClick={handleAddLabTest}
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      Add Lab Test
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowLabOrder(false);
                        setLabOrderErrors({});
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* =================================================
            LAB TEST NOT AVAILABLE
        ================================================= */}

                {showOtherLabTest && (
                  <div className="border rounded p-3 mt-3">
                    <h6 className="mb-3">Add Lab Test Not Available in Lab</h6>

                    {/* Lab Test Name */}
                    <div className="mb-3">
                      <label className="form-label">
                        Lab Test Name <span className="text-danger">*</span>
                      </label>

                      <input
                        type="text"
                        name="lab_test_name"
                        className={`form-control ${
                          otherLabTestErrors.lab_test_name ? "is-invalid" : ""
                        }`}
                        value={otherLabTestForm.lab_test_name}
                        onChange={(e) => {
                          const { value } = e.target;

                          setOtherLabTestForm((prev) => ({
                            ...prev,
                            lab_test_name: value,
                          }));

                          if (
                            otherLabTestErrors.lab_test_name &&
                            value.trim()
                          ) {
                            setOtherLabTestErrors((prev) => ({
                              ...prev,
                              lab_test_name: "",
                            }));
                          }
                        }}
                        placeholder="Enter lab test name"
                      />

                      {otherLabTestErrors.lab_test_name && (
                        <div className="invalid-feedback">
                          {otherLabTestErrors.lab_test_name}
                        </div>
                      )}
                    </div>

                    {/* Instructions */}
                    <div className="mb-3">
                      <label className="form-label">Instructions</label>

                      <textarea
                        className="form-control"
                        rows="3"
                        value={otherLabTestForm.instructions}
                        onChange={(e) =>
                          setOtherLabTestForm((prev) => ({
                            ...prev,
                            instructions: e.target.value,
                          }))
                        }
                        placeholder="Enter instructions"
                      />
                    </div>

                    {/* Buttons */}
                    <button
                      type="button"
                      className="btn btn-primary me-2"
                      onClick={() => {
                        const errors = {};

                        if (!otherLabTestForm.lab_test_name.trim()) {
                          errors.lab_test_name = "Lab test name is required.";
                        }

                        if (Object.keys(errors).length > 0) {
                          setOtherLabTestErrors(errors);
                          return;
                        }

                        const newLabOrder = {
                          lab_test: null,
                          lab_test_name: otherLabTestForm.lab_test_name,
                          instructions: otherLabTestForm.instructions,
                        };

                        setFormData((prev) => ({
                          ...prev,
                          lab_orders: [...prev.lab_orders, newLabOrder],
                        }));

                        setOtherLabTestForm({
                          lab_test_name: "",
                          instructions: "",
                        });

                        setOtherLabTestErrors({});
                        setShowOtherLabTest(false);
                      }}
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      Add Lab Test
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowOtherLabTest(false);
                        setOtherLabTestErrors({});
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* =================================================
            ADDED LAB TESTS
        ================================================= */}

                {formData.lab_orders.length > 0 && (
                  <div className="table-responsive mt-4">
                    <h6 className="fw-semibold mb-3">Added Lab Tests</h6>

                    <table className="table table-bordered align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Lab Test</th>
                          <th>Instructions</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {formData.lab_orders.map((labOrder, index) => (
                          <tr key={index}>
                            <td>
                              {labOrder.lab_test
                                ? labTests.find(
                                    (test) => test.id === labOrder.lab_test,
                                  )?.name || "Unknown Test"
                                : labOrder.lab_test_name}
                            </td>

                            <td>{labOrder.instructions || "-"}</td>

                            <td className="text-center">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    lab_orders: prev.lab_orders.filter(
                                      (_, i) => i !== index,
                                    ),
                                  }));
                                }}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* =================================================
            FORM ACTIONS
        ================================================= */}

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/doctor/appointments")}
          >
            Cancel
          </button>

          <button type="submit" className="btn btn-success" disabled={saving}>
            {saving ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg me-2"></i>
                Save Consultation
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Consultation;
