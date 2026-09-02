// @ts-nocheck
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { getAppointments } from "../../services/doctorService";
import "react-datepicker/dist/react-datepicker.css";

function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStatus, setActiveStatus] = useState("SCHEDULED");

  const [appointments, setAppointments] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // DATE HELPERS
  // =====================================================

  const getDateType = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

    if (selected.getTime() === today.getTime()) {
      return "TODAY";
    }

    if (selected < today) {
      return "PAST";
    }

    return "FUTURE";
  };

  const dateType = getDateType();

  // =====================================================
  // AVAILABLE STATUS TABS
  // =====================================================

  const availableStatuses =
    dateType === "FUTURE"
      ? ["SCHEDULED", "CANCELLED"]
      : ["SCHEDULED", "COMPLETED", "CANCELLED"];

  // =====================================================
  // FORMAT DATE FOR API
  // =====================================================

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // =====================================================
  // FORMAT DISPLAY DATE
  // =====================================================

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // FETCH APPOINTMENTS
  // =====================================================

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAppointments(
        formatDateForAPI(selectedDate),
        activeStatus,
      );

      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);

      setError("Failed to load appointments.");

      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };
  // =====================================================
  // FETCH WHEN DATE / STATUS CHANGES
  // =====================================================

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, activeStatus]);

  // =====================================================
  // DATE CHANGE
  // =====================================================

  const handleDateChange = (date) => {
    setSelectedDate(date);

    // Future dates cannot have completed appointments
    if (
      date &&
      (() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selected = new Date(date);
        selected.setHours(0, 0, 0, 0);

        return selected > today;
      })()
    ) {
      setActiveStatus("SCHEDULED");
    } else {
      setActiveStatus("SCHEDULED");
    }

    setSearch("");
  };

  // =====================================================
  // STATUS CHANGE
  // =====================================================

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    setSearch("");
  };

  // =====================================================
  // SEARCH PATIENT
  // =====================================================

  const filteredAppointments = appointments.filter((appointment) => {
    const patientName = appointment.patient_name?.toLowerCase() || "";

    const patientId = appointment.patient_id?.toLowerCase() || "";

    const searchValue = search.toLowerCase();

    return patientName.includes(searchValue) || patientId.includes(searchValue);
  });

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusBadge = (status) => {
    switch (status) {
      case "SCHEDULED":
        return <span className="badge bg-primary">Scheduled</span>;

      case "COMPLETED":
        return <span className="badge bg-success">Completed</span>;

      case "CANCELLED":
        return <span className="badge bg-danger">Cancelled</span>;

      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  // =====================================================
  // STATUS LABEL
  // =====================================================

  const getStatusLabel = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "Scheduled";

      case "COMPLETED":
        return "Completed";

      case "CANCELLED":
        return "Cancelled";

      default:
        return status;
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-semibold mb-1">Appointments</h3>

          <p className="text-muted mb-0">Manage your patient appointments</p>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={fetchAppointments}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {/* =================================================
          FILTER CARD
      ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-end">
            {/* DATE PICKER */}

            <div className="col-lg-4 mb-3 mb-lg-0">
              <label className="form-label fw-semibold">Appointment Date</label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-calendar3"></i>
                </span>

                {/* <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd MMM yyyy"
                  className="form-control"
                  wrapperClassName="flex-grow-1"
                  placeholderText="Select date"
                /> */}
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd MMM yyyy"
                  className="form-control"
                  wrapperClassName="flex-grow-1"
                  placeholderText="Select date"
                  isClearable={false}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                />
              </div>
            </div>

            {/* STATUS */}

            <div className="col-lg-5 mb-3 mb-lg-0">
              <label className="form-label fw-semibold">
                Appointment Status
              </label>
              {/* <div className="d-flex gap-2"> */}

              <div className="btn-group w-100">
                {availableStatuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`btn ${
                      activeStatus === status
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => handleStatusChange(status)}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>

            {/* SEARCH */}

            <div className="col-lg-3">
              <label className="form-label fw-semibold">Search Patient</label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Name or patient ID"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          DATE SUMMARY
      ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <span className="text-muted">Appointments for </span>

          <strong>{formatDisplayDate(selectedDate)}</strong>
        </div>

        <span className="text-muted">
          {filteredAppointments.length} appointment
          {filteredAppointments.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>

            <p className="text-muted mt-3 mb-0">Loading appointments...</p>
          </div>
        </div>
      ) : (
        /* =================================================
           APPOINTMENT TABLE
        ================================================= */

        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Token</th>

                  <th>Time</th>

                  <th>Patient</th>

                  <th>Appointment Type</th>

                  <th>Status</th>

                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <i className="bi bi-calendar-x fs-2 text-muted"></i>

                      <p className="text-muted mt-3 mb-0">
                        No {getStatusLabel(activeStatus).toLowerCase()}{" "}
                        appointments for this date
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      {/* TOKEN */}

                      <td className="ps-4">
                        <span className="fw-semibold">
                          {appointment.token_number || "-"}
                        </span>
                      </td>

                      {/* TIME */}

                      <td>
                        <span className="fw-semibold">
                          {formatTime(appointment.appointment_time)}
                        </span>
                      </td>

                      {/* PATIENT */}

                      <td>
                        <div className="fw-semibold">
                          {appointment.patient_name || "-"}
                        </div>

                        <small className="text-muted">
                          {appointment.patient_id || ""}
                        </small>
                      </td>

                      {/* TYPE */}

                      <td>
                        {appointment.appointment_type === "WALK_IN"
                          ? "Walk-in"
                          : "Booking"}
                      </td>

                      {/* STATUS */}

                      <td>{getStatusBadge(appointment.status)}</td>

                      {/* ACTION */}

                      <td className="text-end pe-4">
                        {appointment.status === "SCHEDULED" ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              console.log(
                                "Consult appointment:",
                                appointment.id,
                              )
                            }
                          >
                            <i className="bi bi-clipboard2-pulse me-1"></i>
                            Consult
                          </button>
                        ) : appointment.status === "COMPLETED" ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              console.log("View consultation:", appointment.id)
                            }
                          >
                            <i className="bi bi-eye me-1"></i>
                            View
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            disabled
                          >
                            No Action
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;
