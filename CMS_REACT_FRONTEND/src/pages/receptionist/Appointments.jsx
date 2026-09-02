import { useEffect, useState } from "react";
import api from "../../services/api";

function Appointments() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [message, setMessage] = useState("");

  const fetchAppointments = async () => {
    try {
      const response = await api.get("receptionist/appointments/");
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setMessage("Unable to load appointments.");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDateFilter = async () => {
    if (!filterDate) {
      setMessage("Please select a date.");
      return;
    }

    try {
      setMessage("");

      const response = await api.get(
        "receptionist/appointments/",
        {
          params: {
            date: filterDate,
          },
        }
      );

      setAppointments(response.data);
    } catch (error) {
      console.error("Error filtering appointments:", error);
      setMessage("Unable to filter appointments.");
    }
  };

  const clearFilter = async () => {
    setFilterDate("");
    setMessage("");
    await fetchAppointments();
  };

  const goBack = async () => {
    setSelectedAction(null);
    setFilterDate("");
    setMessage("");
    await fetchAppointments();
  };

  // MAIN MENU
  if (!selectedAction) {
    return (
      <div>
        <h2 className="mb-4">Appointments</h2>

        <div className="d-flex flex-wrap gap-3">
          <button
            className="btn text-white p-4"
            style={{
              backgroundColor: "#1976A3",
              width: "250px",
            }}
            onClick={() => setSelectedAction("book")}
          >
            Search Patient & Book Appointment
          </button>

          <button
            className="btn text-white p-4"
            style={{
              backgroundColor: "#1976A3",
              width: "250px",
            }}
            onClick={() => setSelectedAction("view")}
          >
            View Appointments
          </button>

          <button
            className="btn text-white p-4"
            style={{
              backgroundColor: "#1976A3",
              width: "250px",
            }}
            onClick={() => setSelectedAction("filter")}
          >
            Filter by Date
          </button>
        </div>
      </div>
    );
  }

  // BOOK APPOINTMENT
  if (selectedAction === "book") {
    return (
      <div>
        <BackButton onClick={goBack} />

        <h3>Search Patient & Book Appointment</h3>

        <div className="alert alert-info mt-3">
          Doctor selection will be connected when the Doctor API
          becomes available.
        </div>
      </div>
    );
  }

  // VIEW ALL
  if (selectedAction === "view") {
    return (
      <div>
        <BackButton onClick={goBack} />

        <h3>View Appointments</h3>

        {message && <p className="mt-3">{message}</p>}

        <AppointmentTable appointments={appointments} />
      </div>
    );
  }

  // FILTER BY DATE
  if (selectedAction === "filter") {
    return (
      <div>
        <BackButton onClick={goBack} />

        <h3>Filter Appointments by Date</h3>

        <div className="row g-2 mt-3">
          <div className="col-md-5">
            <input
              type="date"
              className="form-control"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          <div className="col-md-7">
            <button
              type="button"
              className="btn text-white me-2"
              style={{ backgroundColor: "#1976A3" }}
              onClick={handleDateFilter}
            >
              Filter
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearFilter}
            >
              Clear
            </button>
          </div>
        </div>

        {message && <p className="mt-3">{message}</p>}

        <AppointmentTable appointments={appointments} />
      </div>
    );
  }

  return null;
}

function AppointmentTable({ appointments }) {
  return (
    <div className="table-responsive mt-4">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Type</th>
            <th>Date</th>
            <th>Time</th>
            <th>Token</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.patient}</td>
                <td>{appointment.doctor}</td>
                <td>{appointment.appointment_type}</td>
                <td>{appointment.appointment_date}</td>
                <td>{appointment.appointment_time}</td>
                <td>{appointment.token_number}</td>
                <td>{appointment.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      className="btn btn-secondary mb-3"
      onClick={onClick}
    >
      ← Back
    </button>
  );
}

export default Appointments;

