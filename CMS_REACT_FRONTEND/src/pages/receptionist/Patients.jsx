import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";

function Patients() {
  const location = useLocation();
  const [selectedAction, setSelectedAction] = useState(null);
  const [patients, setPatients] = useState([]);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [editingPatient, setEditingPatient] = useState(null);
  const [viewingPatient, setViewingPatient] = useState(null);

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

  // =======================================================
  // FETCH ALL PATIENTS
  // =======================================================

  const fetchPatients = async () => {
    try {
      const response = await api.get(
        "receptionist/patients/"
      );

      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);

      setPatients([]);
      setMessage("Unable to load patients.");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // =======================================================
  // SIDEBAR RESET
  // =======================================================

  useEffect(() => {
    if (location.state?.resetSection) {
      setSelectedAction(null);

      setEditingPatient(null);
      setViewingPatient(null);

      setSearchType("patient_id");
      setSearchValue("");

      setMessage("");
      setFieldErrors({});

      setFormData(emptyForm);

      fetchPatients();
    }
  }, [location.state?.resetKey]);

  // =======================================================
  // COMMON HELPERS
  // =======================================================

  const clearMessages = () => {
    setMessage("");
    setFieldErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const getErrorMessage = (value) => {
    if (Array.isArray(value)) {
      return value.join(" ");
    }

    if (typeof value === "string") {
      return value;
    }

    return "";
  };

  const handleApiErrors = (
    error,
    fallbackMessage
  ) => {
    const data = error.response?.data;

    if (!data || typeof data !== "object") {
      setMessage(fallbackMessage);
      return;
    }

    const newFieldErrors = {};
    const generalMessages = [];

    Object.entries(data).forEach(
      ([key, value]) => {
        const errorText =
          getErrorMessage(value);

        if (
          Object.prototype.hasOwnProperty.call(
            emptyForm,
            key
          )
        ) {
          newFieldErrors[key] = errorText;
        } else {
          generalMessages.push(errorText);
        }
      }
    );

    setFieldErrors(newFieldErrors);

    if (generalMessages.length > 0) {
      setMessage(
        generalMessages.join(" ")
      );
    }
  };

  // =======================================================
  // REGISTER PATIENT
  // =======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    clearMessages();

    try {
      await api.post(
        "receptionist/patients/",
        formData
      );

      setMessage(
        "Patient registered successfully."
      );

      setFormData(emptyForm);

      await fetchPatients();
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      handleApiErrors(
        error,
        "Patient registration failed."
      );
    }
  };

  // =======================================================
  // SEARCH PATIENT
  // =======================================================

  const handleSearch = async () => {
    clearMessages();

    const value = searchValue.trim();

    // If search is empty, show all patients again.
    if (!value) {
      await fetchPatients();

      setMessage(
        "Please enter a search value."
      );

      return;
    }

    try {
      const response = await api.get(
        "receptionist/patients/",
        {
          params: {
            [searchType]: value,
          },
        }
      );

      setPatients(response.data);

      if (response.data.length === 0) {
        setMessage("No patients found.");
      }
    } catch (error) {
      console.error(
        "Search error:",
        error
      );

      setPatients([]);
      setMessage(
        "Unable to search patient."
      );
    }
  };

  // =======================================================
  // CLEAR SEARCH
  // =======================================================

  const handleClearSearch = async () => {
    setSearchValue("");

    clearMessages();

    // Restore all patient details.
    await fetchPatients();
  };

  // =======================================================
  // VIEW PATIENT
  // =======================================================

  const handleView = (patient) => {
    setViewingPatient(patient);
    setEditingPatient(null);

    clearMessages();

    setSelectedAction("view");
  };

  // =======================================================
  // EDIT PATIENT
  // =======================================================

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setViewingPatient(null);

    setFormData({
      patient_name:
        patient.patient_name || "",

      date_of_birth:
        patient.date_of_birth || "",

      gender:
        patient.gender || "",

      address:
        patient.address || "",

      mobile_number:
        patient.mobile_number || "",

      email:
        patient.email || "",

      blood_group:
        patient.blood_group || "",
    });

    clearMessages();

    setSelectedAction("edit");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingPatient) {
      return;
    }

    clearMessages();

    try {
      const response = await api.patch(
        `receptionist/patients/${editingPatient.id}/`,
        formData
      );

      setEditingPatient(response.data);

      setFormData({
        patient_name:
          response.data.patient_name || "",

        date_of_birth:
          response.data.date_of_birth || "",

        gender:
          response.data.gender || "",

        address:
          response.data.address || "",

        mobile_number:
          response.data.mobile_number || "",

        email:
          response.data.email || "",

        blood_group:
          response.data.blood_group || "",
      });

      setMessage(
        "Patient updated successfully."
      );

      await fetchPatients();
    } catch (error) {
      console.error(
        "Update error:",
        error
      );

      handleApiErrors(
        error,
        "Unable to update patient."
      );
    }
  };

  // =======================================================
  // MAKE ACTIVE / INACTIVE
  // =======================================================

  const handleToggleStatus = async (
    patient
  ) => {
    clearMessages();

    try {
      await api.patch(
        `receptionist/patients/${patient.id}/`,
        {
          is_active:
            !patient.is_active,
        }
      );

      setMessage(
        patient.is_active
          ? "Patient marked as inactive successfully."
          : "Patient marked as active successfully."
      );

      // If a search is currently active,
      // refresh the same search results.
      if (searchValue.trim()) {
        const response = await api.get(
          "receptionist/patients/",
          {
            params: {
              [searchType]:
                searchValue.trim(),
            },
          }
        );

        setPatients(response.data);
      } else {
        // Otherwise restore the full patient list.
        await fetchPatients();
      }
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      setMessage(
        "Unable to update patient status."
      );
    }
  };

  // =======================================================
  // NAVIGATION
  // =======================================================

  const goToMainMenu = () => {
    setSelectedAction(null);

    setEditingPatient(null);
    setViewingPatient(null);

    setMessage("");
    setFieldErrors({});

    setSearchValue("");

    setFormData(emptyForm);
  };

  const goBackToSearch = async () => {
    setSelectedAction("search");

    setEditingPatient(null);
    setViewingPatient(null);

    setMessage("");
    setFieldErrors({});

    setFormData(emptyForm);

    // If the user previously searched,
    // restore the same search results.
    if (searchValue.trim()) {
      try {
        const response = await api.get(
          "receptionist/patients/",
          {
            params: {
              [searchType]:
                searchValue.trim(),
            },
          }
        );

        setPatients(response.data);
      } catch (error) {
        console.error(
          "Search refresh error:",
          error
        );
      }
    } else {
      // If there is no active search,
      // display all patients.
      await fetchPatients();
    }
  };

  // =======================================================
  // MAIN PATIENT MENU
  // =======================================================

  if (!selectedAction) {
    return (
      <div>
        <h2 className="mb-4">
          Patients
        </h2>

        <div className="d-flex flex-wrap gap-3">
          <button
            type="button"
            className="btn text-white p-4"
            style={{
              backgroundColor:
                "#1976A3",

              width: "250px",
            }}
            onClick={() => {
              clearMessages();

              setFormData(
                emptyForm
              );

              setSelectedAction(
                "register"
              );
            }}
          >
            Register Patient
          </button>

          <button
            type="button"
            className="btn text-white p-4"
            style={{
              backgroundColor:
                "#1976A3",

              width: "250px",
            }}
            onClick={async () => {
              clearMessages();

              setSearchValue("");

              setSelectedAction(
                "search"
              );

              // IMPORTANT:
              // Show all patients immediately.
              await fetchPatients();
            }}
          >
            Search / Edit Patient
          </button>
        </div>
      </div>
    );
  }

  // =======================================================
  // REGISTER PATIENT
  // =======================================================

  if (
    selectedAction ===
    "register"
  ) {
    return (
      <div>
        <BackButton
          onClick={
            goToMainMenu
          }
        />

        <h3>
          Register Patient
        </h3>

        <PatientForm
          formData={
            formData
          }
          fieldErrors={
            fieldErrors
          }
          handleChange={
            handleChange
          }
          handleSubmit={
            handleSubmit
          }
          buttonText="Register Patient"
        />

        {message && (
          <div className="alert alert-info mt-3">
            {message}
          </div>
        )}
      </div>
    );
  }

  // =======================================================
  // SEARCH / EDIT PATIENT
  // =======================================================

  if (
    selectedAction ===
    "search"
  ) {
    return (
      <div>
        <BackButton
          onClick={
            goToMainMenu
          }
        />

        <h3>
          Search / Edit Patient
        </h3>

        {/* SEARCH CONTROLS */}

        <div className="row g-2 mt-3 align-items-end">
          <div className="col-12 col-md-3">
            <label className="form-label">
              Search By
            </label>

            <select
              className="form-select"
              value={
                searchType
              }
              onChange={async (
                e
              ) => {
                setSearchType(
                  e.target
                    .value
                );

                setSearchValue(
                  ""
                );

                clearMessages();

                // Keep all patients displayed
                // when changing search type.
                await fetchPatients();
              }}
            >
              <option value="patient_id">
                Patient ID
              </option>

              <option value="patient_name">
                Patient Name
              </option>

              <option value="mobile_number">
                Mobile Number
              </option>
            </select>
          </div>

          <div className="col-12 col-md-5">
            <label className="form-label">
              Search Value
            </label>

            <input
              type="text"
              className="form-control"
              value={
                searchValue
              }
              onChange={(e) =>
                setSearchValue(
                  e.target
                    .value
                )
              }
              onKeyDown={(
                e
              ) => {
                if (
                  e.key ===
                  "Enter"
                ) {
                  handleSearch();
                }
              }}
              placeholder={
                searchType ===
                "patient_id"
                  ? "Enter Patient ID"
                  : searchType ===
                    "patient_name"
                  ? "Enter Patient Name"
                  : "Enter Mobile Number"
              }
            />
          </div>

          <div className="col-12 col-md-4">
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn text-white"
                style={{
                  backgroundColor:
                    "#1976A3",
                }}
                onClick={
                  handleSearch
                }
              >
                Search
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={
                  handleClearSearch
                }
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {message && (
          <div className="alert alert-info mt-3">
            {message}
          </div>
        )}

        {/* PATIENT LIST */}

        <div className="mt-4">
          <h5 className="mb-3">
            Patient Details
          </h5>

          <PatientTable
            patients={
              patients
            }
            onView={
              handleView
            }
            onEdit={
              handleEdit
            }
            onToggleStatus={
              handleToggleStatus
            }
          />
        </div>
      </div>
    );
  }

  // =======================================================
  // VIEW PATIENT
  // =======================================================

  if (
    selectedAction ===
      "view" &&
    viewingPatient
  ) {
    return (
      <div>
        <BackButton
          onClick={
            goBackToSearch
          }
        />

        <h3 className="mb-4">
          Patient Details
        </h3>

        <div
          className="card shadow-sm"
          style={{
            maxWidth:
              "750px",
          }}
        >
          <div className="card-body">
            <PatientDetailRow
              label="Patient ID"
              value={
                viewingPatient.patient_id
              }
            />

            <PatientDetailRow
              label="Patient Name"
              value={
                viewingPatient.patient_name
              }
            />

            <PatientDetailRow
              label="Date of Birth"
              value={
                viewingPatient.date_of_birth
              }
            />

            <PatientDetailRow
              label="Gender"
              value={
                viewingPatient.gender
              }
            />

            <PatientDetailRow
              label="Address"
              value={
                viewingPatient.address
              }
            />

            <PatientDetailRow
              label="Mobile Number"
              value={
                viewingPatient.mobile_number
              }
            />

            <PatientDetailRow
              label="Email"
              value={
                viewingPatient.email ||
                "-"
              }
            />

            <PatientDetailRow
              label="Blood Group"
              value={
                viewingPatient.blood_group ||
                "-"
              }
            />

            <PatientDetailRow
              label="Status"
              value={
                viewingPatient.is_active
                  ? "Active"
                  : "Inactive"
              }
            />

            <div className="mt-4 d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-warning"
                onClick={() =>
                  handleEdit(
                    viewingPatient
                  )
                }
              >
                Edit Patient
              </button>

              <button
                type="button"
                className={`btn ${
                  viewingPatient.is_active
                    ? "btn-danger"
                    : "btn-success"
                }`}
                onClick={async () => {
                  await handleToggleStatus(
                    viewingPatient
                  );

                  try {
                    const response =
                      await api.get(
                        `receptionist/patients/${viewingPatient.id}/`
                      );

                    setViewingPatient(
                      response.data
                    );
                  } catch (
                    error
                  ) {
                    console.error(
                      "Unable to refresh patient:",
                      error
                    );
                  }
                }}
              >
                {viewingPatient.is_active
                  ? "Make Inactive"
                  : "Make Active"}
              </button>
            </div>
          </div>
        </div>

        {message && (
          <div className="alert alert-info mt-3">
            {message}
          </div>
        )}
      </div>
    );
  }

  // =======================================================
  // EDIT PATIENT
  // =======================================================

  if (
    selectedAction ===
      "edit" &&
    editingPatient
  ) {
    return (
      <div>
        <BackButton
          onClick={
            goBackToSearch
          }
        />

        <h3>
          Edit Patient
        </h3>

        <p className="text-muted mb-3">
          Patient ID:{" "}
          {
            editingPatient.patient_id
          }
        </p>

        <PatientForm
          formData={
            formData
          }
          fieldErrors={
            fieldErrors
          }
          handleChange={
            handleChange
          }
          handleSubmit={
            handleUpdate
          }
          buttonText="Save Changes"
        />

        {message && (
          <div className="alert alert-info mt-3">
            {message}
          </div>
        )}
      </div>
    );
  }

  return null;
}

// =========================================================
// PATIENT FORM
// =========================================================

function PatientForm({
  formData,
  fieldErrors,
  handleChange,
  handleSubmit,
  buttonText,
}) {
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="mt-3"
      style={{
        maxWidth:
          "750px",
      }}
      noValidate
    >
      <FormFieldError
        error={
          fieldErrors.patient_name
        }
      >
        <label className="form-label">
          Patient Name
        </label>

        <input
          type="text"
          className={`form-control ${
            fieldErrors.patient_name
              ? "is-invalid"
              : ""
          }`}
          name="patient_name"
          value={
            formData.patient_name
          }
          onChange={
            handleChange
          }
          required
        />
      </FormFieldError>

      <FormFieldError
        error={
          fieldErrors.date_of_birth
        }
      >
        <label className="form-label">
          Date of Birth
        </label>

        <input
          type="date"
          className={`form-control ${
            fieldErrors.date_of_birth
              ? "is-invalid"
              : ""
          }`}
          name="date_of_birth"
          value={
            formData.date_of_birth
          }
          max={
            today
          }
          onChange={
            handleChange
          }
          required
        />
      </FormFieldError>

      <FormFieldError
        error={
          fieldErrors.gender
        }
      >
        <label className="form-label">
          Gender
        </label>

        <select
          className={`form-select ${
            fieldErrors.gender
              ? "is-invalid"
              : ""
          }`}
          name="gender"
          value={
            formData.gender
          }
          onChange={
            handleChange
          }
          required
        >
          <option value="">
            Select Gender
          </option>

          <option value="MALE">
            Male
          </option>

          <option value="FEMALE">
            Female
          </option>

          <option value="OTHER">
            Other
          </option>
        </select>
      </FormFieldError>

      <FormFieldError
        error={
          fieldErrors.address
        }
      >
        <label className="form-label">
          Address
        </label>

        <textarea
          className={`form-control ${
            fieldErrors.address
              ? "is-invalid"
              : ""
          }`}
          name="address"
          value={
            formData.address
          }
          onChange={
            handleChange
          }
          rows="3"
          required
        />
      </FormFieldError>

      <FormFieldError
        error={
          fieldErrors.mobile_number
        }
      >
        <label className="form-label">
          Mobile Number
        </label>

        <input
          type="text"
          className={`form-control ${
            fieldErrors.mobile_number
              ? "is-invalid"
              : ""
          }`}
          name="mobile_number"
          value={
            formData.mobile_number
          }
          onChange={
            handleChange
          }
          maxLength="10"
          inputMode="numeric"
          required
        />
      </FormFieldError>

      <FormFieldError
        error={
          fieldErrors.email
        }
      >
        <label className="form-label">
          Email
        </label>

        <input
          type="email"
          className={`form-control ${
            fieldErrors.email
              ? "is-invalid"
              : ""
          }`}
          name="email"
          value={
            formData.email
          }
          onChange={
            handleChange
          }
        />
      </FormFieldError>

      <FormFieldError
        error={
          fieldErrors.blood_group
        }
      >
        <label className="form-label">
          Blood Group
        </label>

        <select
          className={`form-select ${
            fieldErrors.blood_group
              ? "is-invalid"
              : ""
          }`}
          name="blood_group"
          value={
            formData.blood_group
          }
          onChange={
            handleChange
          }
        >
          <option value="">
            Select Blood Group
          </option>

          <option value="A+">
            A+
          </option>

          <option value="A-">
            A-
          </option>

          <option value="B+">
            B+
          </option>

          <option value="B-">
            B-
          </option>

          <option value="AB+">
            AB+
          </option>

          <option value="AB-">
            AB-
          </option>

          <option value="O+">
            O+
          </option>

          <option value="O-">
            O-
          </option>
        </select>
      </FormFieldError>

      <button
        type="submit"
        className="btn text-white"
        style={{
          backgroundColor:
            "#1976A3",
        }}
      >
        {buttonText}
      </button>
    </form>
  );
}

// =========================================================
// FIELD ERROR
// =========================================================

function FormFieldError({
  error,
  children,
}) {
  return (
    <div className="mb-3">
      {children}

      {error && (
        <div
          className="text-danger mt-1"
          style={{
            fontSize:
              "0.875rem",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

// =========================================================
// PATIENT TABLE
// =========================================================

function PatientTable({
  patients,
  onView,
  onEdit,
  onToggleStatus,
}) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle">
        <thead>
          <tr>
            <th className="text-nowrap">
              Patient ID
            </th>

            <th>
              Name
            </th>

            <th className="text-nowrap">
              Mobile
            </th>

            <th>
              Gender
            </th>

            <th className="text-nowrap">
              Blood Group
            </th>

            <th>
              Status
            </th>

            <th className="text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {patients.length >
          0 ? (
            patients.map(
              (
                patient
              ) => (
                <tr
                  key={
                    patient.id
                  }
                >
                  <td className="text-nowrap">
                    {
                      patient.patient_id
                    }
                  </td>

                  <td>
                    {
                      patient.patient_name
                    }
                  </td>

                  <td className="text-nowrap">
                    {
                      patient.mobile_number
                    }
                  </td>

                  <td>
                    {
                      patient.gender
                    }
                  </td>

                  <td>
                    {patient.blood_group ||
                      "-"}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        patient.is_active
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {patient.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <div className="d-flex flex-column flex-xl-row justify-content-center gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-primary text-nowrap"
                        onClick={() =>
                          onView(
                            patient
                          )
                        }
                      >
                        View
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-warning text-nowrap"
                        onClick={() =>
                          onEdit(
                            patient
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className={`btn btn-sm text-nowrap ${
                          patient.is_active
                            ? "btn-danger"
                            : "btn-success"
                        }`}
                        onClick={() =>
                          onToggleStatus(
                            patient
                          )
                        }
                      >
                        {patient.is_active
                          ? "Make Inactive"
                          : "Make Active"}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center py-4"
              >
                No patients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// =========================================================
// PATIENT DETAILS ROW
// =========================================================

function PatientDetailRow({
  label,
  value,
}) {
  return (
    <div className="row py-2 border-bottom">
      <div className="col-sm-4 fw-bold">
        {label}
      </div>

      <div className="col-sm-8">
        {value || "-"}
      </div>
    </div>
  );
}

// =========================================================
// BACK BUTTON
// =========================================================

function BackButton({
  onClick,
}) {
  return (
    <button
      type="button"
      className="btn btn-secondary mb-3"
      onClick={
        onClick
      }
    >
      ← Back
    </button>
  );
}

export default Patients;

