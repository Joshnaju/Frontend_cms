import { useEffect, useState } from "react";
import api from "../../services/api";

function ConsultationBills() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [bills, setBills] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // LOAD BILLS
  const fetchBills = async () => {
    try {
      const response = await api.get(
        "receptionist/consultation-bills/"
      );

      setBills(response.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setMessage("Unable to load consultation bills.");
      setMessageType("danger");
    }
  };

  // LOAD APPOINTMENTS
  const fetchAppointments = async () => {
    try {
      const response = await api.get(
        "receptionist/appointments/"
      );

      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setMessage("Unable to load appointments.");
      setMessageType("danger");
    }
  };

  useEffect(() => {
    fetchBills();
    fetchAppointments();
  }, []);

  // CREATE BILL
  const handleCreateBill = async (e) => {
    e.preventDefault();

    if (!selectedAppointment) {
      setMessage("Please select an appointment.");
      setMessageType("warning");
      return;
    }

    try {
      const response = await api.post(
        "receptionist/consultation-bills/",
        {
          appointment: Number(selectedAppointment),
        }
      );

      setMessage("Consultation bill created successfully.");
      setMessageType("success");

      setSelectedAppointment("");

      await fetchBills();

      setSelectedBill(response.data);
    } catch (error) {
      console.error("Error creating bill:", error);

      if (error.response?.data) {
        const errorData = error.response.data;

        if (typeof errorData === "string") {
          setMessage(errorData);
        } else {
          setMessage(
            Object.values(errorData).flat().join(" ")
          );
        }
      } else {
        setMessage("Unable to create consultation bill.");
      }

      setMessageType("danger");
    }
  };

  const goBack = async () => {
    setSelectedAction(null);
    setSelectedBill(null);
    setSelectedAppointment("");
    setMessage("");
    setMessageType("");

    await fetchBills();
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setSelectedAction("bill-details");
    setMessage("");
  };

  // MAIN MENU
  if (!selectedAction) {
    return (
      <div>
        <h2 className="mb-4">Consultation Bills</h2>

        <div className="d-flex flex-wrap gap-3">
          <button
            className="btn text-white p-4"
            style={{
              backgroundColor: "#1976A3",
              width: "250px",
            }}
            onClick={() => {
              setSelectedAction("create");
              setMessage("");
              setSelectedBill(null);
              fetchAppointments();
            }}
          >
            Create Consultation Bill
          </button>

          <button
            className="btn text-white p-4"
            style={{
              backgroundColor: "#1976A3",
              width: "250px",
            }}
            onClick={() => {
              setSelectedAction("view");
              setMessage("");
              fetchBills();
            }}
          >
            View Consultation Bills
          </button>
        </div>
      </div>
    );
  }

  // CREATE BILL
  if (selectedAction === "create") {
    return (
      <div>
        <BackButton onClick={goBack} />

        <h3>Create Consultation Bill</h3>

        <form
          onSubmit={handleCreateBill}
          className="mt-4"
          style={{ maxWidth: "600px" }}
        >
          <div className="mb-3">
            <label className="form-label">
              Select Appointment
            </label>

            <select
              className="form-select"
              value={selectedAppointment}
              onChange={(e) => {
                setSelectedAppointment(e.target.value);
                setMessage("");
                setSelectedBill(null);
              }}
              required
            >
              <option value="">
                Select Appointment
              </option>

              {appointments.map((appointment) => (
                <option
                  key={appointment.id}
                  value={appointment.id}
                >
                  Appointment #{appointment.id} - Patient{" "}
                  {appointment.patient} -{" "}
                  {appointment.appointment_date} -{" "}
                  {appointment.appointment_time}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn text-white"
            style={{
              backgroundColor: "#1976A3",
            }}
          >
            Create Bill
          </button>
        </form>

        {message && (
          <div
            className={`alert alert-${messageType || "info"} mt-3`}
            style={{ maxWidth: "600px" }}
          >
            {message}
          </div>
        )}

        {selectedBill && (
          <div
            className="card mt-4"
            style={{ maxWidth: "600px" }}
          >
            <div className="card-body">
              <h5 className="card-title mb-3">
                Bill Created
              </h5>

              <p>
                <strong>Bill ID:</strong>{" "}
                {selectedBill.id}
              </p>

              <p>
                <strong>Appointment:</strong>{" "}
                {selectedBill.appointment}
              </p>

              <p>
                <strong>Registration Fee:</strong>{" "}
                ₹{selectedBill.registration_fee}
              </p>

              <p>
                <strong>Consultation Fee:</strong>{" "}
                ₹{selectedBill.consultation_fee}
              </p>

              <p className="mb-0">
                <strong>Total Amount:</strong>{" "}
                ₹{selectedBill.total_amount}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // VIEW ALL BILLS
  if (selectedAction === "view") {
    return (
      <div>
        <BackButton onClick={goBack} />

        <h3>View Consultation Bills</h3>

        {message && (
          <div
            className={`alert alert-${messageType || "info"} mt-3`}
          >
            {message}
          </div>
        )}

        <BillTable
          bills={bills}
          onViewBill={handleViewBill}
        />
      </div>
    );
  }

  // INDIVIDUAL BILL DETAILS
  if (
    selectedAction === "bill-details" &&
    selectedBill
  ) {
    return (
      <div>
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={() => {
            setSelectedBill(null);
            setSelectedAction("view");
          }}
        >
          ← Back
        </button>

        <h3>Consultation Bill Details</h3>

        <div
          className="card mt-4"
          style={{ maxWidth: "650px" }}
        >
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Bill ID:</strong>
              </div>

              <div className="col-md-6">
                {selectedBill.id}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Appointment:</strong>
              </div>

              <div className="col-md-6">
                {selectedBill.appointment}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Registration Fee:</strong>
              </div>

              <div className="col-md-6">
                ₹{selectedBill.registration_fee}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Consultation Fee:</strong>
              </div>

              <div className="col-md-6">
                ₹{selectedBill.consultation_fee}
              </div>
            </div>

            <hr />

            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Total Amount:</strong>
              </div>

              <div className="col-md-6 fw-bold">
                ₹{selectedBill.total_amount}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <strong>Created At:</strong>
              </div>

              <div className="col-md-6">
                {selectedBill.created_at
                  ? new Date(
                      selectedBill.created_at
                    ).toLocaleString()
                  : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}


// BILL TABLE
function BillTable({ bills, onViewBill }) {
  return (
    <div className="table-responsive mt-4">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Bill ID</th>
            <th>Appointment</th>
            <th>Registration Fee</th>
            <th>Consultation Fee</th>
            <th>Total Amount</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {bills.length > 0 ? (
            bills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.id}</td>

                <td>{bill.appointment}</td>

                <td>₹{bill.registration_fee}</td>

                <td>₹{bill.consultation_fee}</td>

                <td>₹{bill.total_amount}</td>

                <td>
                  {bill.created_at
                    ? new Date(
                        bill.created_at
                      ).toLocaleString()
                    : "-"}
                </td>

                <td>
                  <button
                    type="button"
                    className="btn btn-sm text-white"
                    style={{
                      backgroundColor: "#1976A3",
                    }}
                    onClick={() => onViewBill(bill)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center"
              >
                No consultation bills found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


// BACK BUTTON
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

export default ConsultationBills;

