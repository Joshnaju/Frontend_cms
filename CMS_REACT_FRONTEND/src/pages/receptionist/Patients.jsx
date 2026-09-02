import { useEffect, useState } from "react";
import api from "../../services/api";

function Patients() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [patients, setPatients] = useState([]);
  const [message, setMessage] = useState("");
  const [editingPatient, setEditingPatient] = useState(null);

  const [searchType, setSearchType] = useState("patient_id");
  const [searchValue, setSearchValue] = useState("");

  const emptyForm = {
    patient_name: "",
    date_of_birth: "",
    gender: "",
    address: "",
    mobile_number: "",
    email: "",
    blood_group: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  const fetchPatients = async () => {
    try {
      const response = await api.get("receptionist/patients/");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // REGISTER
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("receptionist/patients/", formData);

      setMessage("Patient registered successfully.");
      setFormData(emptyForm);

      await fetchPatients();
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response?.data) {
        setMessage(
          Object.values(error.response.data).flat().join(" ")
        );
      } else {
        setMessage("Patient registration failed.");
      }
    }
  };

  // SEARCH
  const handleSearch = async () => {
    try {
      setMessage("");

      if (!searchValue.trim()) {
        await fetchPatients();
        return;
      }

      const response = await api.get("receptionist/patients/", {
        params: {
          [searchType]: searchValue.trim(),
        },
      });

      setPatients(response.data);
    } catch (error) {
      console.error("Search error:", error);
      setMessage("Unable to search patient.");
    }
  };

  // EDIT BUTTON
  const handleEdit = (patient) => {
    setEditingPatient(patient);

    setFormData({
      patient_name: patient.patient_name || "",
      date_of_birth: patient.date_of_birth || "",
      gender: patient.gender || "",
      address: patient.address || "",
      mobile_number: patient.mobile_number || "",
      email: patient.email || "",
      blood_group: patient.blood_group || "",
    });

    setMessage("");
    setSelectedAction("edit");
  };

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingPatient) return;

    try {
      await api.patch(
        `receptionist/patients/${editingPatient.id}/`,
        formData
      );

      setMessage("Patient updated successfully.");

      await fetchPatients();

      setEditingPatient(null);
      setFormData(emptyForm);
      setSelectedAction("details");
    } catch (error) {
      console.error("Update error:", error);

      if (error.response?.data) {
        setMessage(
          Object.values(error.response.data).flat().join(" ")
        );
      } else {
        setMessage("Unable to update patient.");
      }
    }
  };

  // DISABLE / ENABLE
  const handleToggleStatus = async (patient) => {
    try {
      await api.patch(
        `receptionist/patients/${patient.id}/`,
        {
          is_active: !patient.is_active,
        }
      );

      setMessage(
        patient.is_active
          ? "Patient disabled successfully."
          : "Patient enabled successfully."
      );

      await fetchPatients();
    } catch (error) {
      console.error("Status update error:", error);
      setMessage("Unable to update patient status.");
    }
  };

  const goBack = async () => {
    setSelectedAction(null);
    setEditingPatient(null);
    setMessage("");
    setSearchValue("");
    setFormData(emptyForm);

    await fetchPatients();
  };

  // MAIN PATIENT MENU
  if (!selectedAction) {
    return (
      <div>
        <h2 className="mb-4">Patients</h2>

        <div className="d-flex flex-wrap gap-3">
          <button
            className="btn text-white p-4"
            style={{
              backgroundColor: "#1976A3",
              width: "250px",
            }}
            onClick={() => setSelectedAction("register")}
          >
            Register Patient
          </button>

          <button
            className="btn text-white p-4"
            style={{
              backgroundColor: "#1976A3",
              width: "250px",
            }}
            onClick={() => setSelectedAction("search")}
          >
            Search Patient
          </button>

          <button
            className="btn text-white p-4"
            style={{
              backgroundColor: "#1976A3",
              width: "250px",
            }}
            onClick={() => setSelectedAction("details")}
          >
            Patient Details
          </button>
        </div>
      </div>
    );
  }

  // REGISTER
  if (selectedAction === "register") {
    return (
      <div>
        <BackButton onClick={goBack} />

        <h3>Register Patient</h3>

        <PatientForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          buttonText="Register Patient"
        />

        {message && <p className="mt-3">{message}</p>}
      </div>
    );
  }

  // SEARCH
  if (selectedAction === "search") {
    return (
      <div>
        <BackButton onClick={goBack} />

        <h3>Search Patient</h3>

        <div className="row g-2 mt-3">
          <div className="col-md-3">
            <select
              className="form-select"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="patient_id">Patient ID</option>
              <option value="mobile_number">Mobile Number</option>
            </select>
          </div>

          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={
                searchType === "patient_id"
                  ? "Enter Patient ID"
                  : "Enter Mobile Number"
              }
            />
          </div>

          <div className="col-md-4">
            <button
              type="button"
              className="btn text-white me-2"
              style={{ backgroundColor: "#1976A3" }}
              onClick={handleSearch}
            >
              Search
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={async () => {
                setSearchValue("");
                setMessage("");
                await fetchPatients();
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {message && <p className="mt-3">{message}</p>}

        <PatientTable
          patients={patients}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    );
  }

  // DETAILS
  if (selectedAction === "details") {
    return (
      <div>
        <BackButton onClick={goBack} />

        <h3>Patient Details</h3>

        {message && <p className="mt-3">{message}</p>}

        <PatientTable
          patients={patients}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    );
  }

  // EDIT
  if (selectedAction === "edit" && editingPatient) {
    return (
      <div>
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={() => {
            setSelectedAction("details");
            setEditingPatient(null);
            setMessage("");
            setFormData(emptyForm);
          }}
        >
          ← Back
        </button>

        <h3>Edit Patient</h3>

        <PatientForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleUpdate}
          buttonText="Update Patient"
        />

        {message && <p className="mt-3">{message}</p>}
      </div>
    );
  }

  return null;
}

function PatientForm({
  formData,
  handleChange,
  handleSubmit,
  buttonText,
}) {
  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="mb-3">
        <label>Patient Name</label>
        <input
          type="text"
          className="form-control"
          name="patient_name"
          value={formData.patient_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label>Date of Birth</label>
        <input
          type="date"
          className="form-control"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label>Gender</label>
        <select
          className="form-select"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div className="mb-3">
        <label>Address</label>
        <textarea
          className="form-control"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label>Mobile Number</label>
        <input
          type="text"
          className="form-control"
          name="mobile_number"
          value={formData.mobile_number}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label>Blood Group</label>
        <select
          className="form-select"
          name="blood_group"
          value={formData.blood_group}
          onChange={handleChange}
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>

      <button
        type="submit"
        className="btn text-white"
        style={{ backgroundColor: "#1976A3" }}
      >
        {buttonText}
      </button>
    </form>
  );
}

function PatientTable({ patients, onEdit, onToggleStatus }) {
  return (
    <div className="table-responsive mt-4">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Gender</th>
            <th>Blood Group</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.patient_id}</td>
                <td>{patient.patient_name}</td>
                <td>{patient.mobile_number}</td>
                <td>{patient.gender}</td>
                <td>{patient.blood_group || "-"}</td>

                <td>
                  {patient.is_active ? "Active" : "Disabled"}
                </td>

                <td>
                  <button
                    type="button"
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => onEdit(patient)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm ${
                      patient.is_active
                        ? "btn-danger"
                        : "btn-success"
                    }`}
                    onClick={() => onToggleStatus(patient)}
                  >
                    {patient.is_active ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No patients found.
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

export default Patients;

