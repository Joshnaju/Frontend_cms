import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConsultedPatients } from "../../../services/doctorService";

function DoctorPatientsHistroy() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getConsultedPatients();

      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);

      setError("Failed to load patients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const searchValue = search.toLowerCase();

    return (
      patient.patient_name?.toLowerCase().includes(searchValue) ||
      patient.patient_id?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="container-fluid py-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-semibold mb-1">Patients</h3>

          <p className="text-muted mb-0">Patients consulted by you</p>
        </div>

        <button
          type="button"
          onClick={fetchPatients}
          disabled={loading}
          className="btn"
          style={{
            backgroundColor: "var(--bs-primary-text-emphasis)",
            color: "white",
          }}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>
      {/* Search */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-4">
              <label className="form-label fw-semibold mb-2">
                Search Patient
              </label>

              <div className="input-group input-group-sm border rounded">
                {/* Search Icon */}
                <span className="input-group-text bg-white border-0">
                  <i className="bi bi-search text-muted"></i>
                </span>

                {/* Input */}
                <input
                  type="text"
                  className="form-control bg-white border-0 shadow-none"
                  placeholder="Name or patient ID"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {/* Clear */}
                {search && (
                  <button
                    type="button"
                    className="btn bg-white border-0"
                    onClick={() => setSearch("")}
                    title="Clear search"
                  >
                    <i className="bi bi-x-lg text-muted"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-4">
              <label className="form-label fw-semibold">Search Patient</label>

              <div className="input-group">
           
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search"></i>
                </span>

    
                <input
                  type="text"
                  className="form-control border-start-0 border-end-0"
                  placeholder="Name or patient ID"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    boxShadow: "none",
                    outline: "none",
                  }}
                />

            
                {search && (
                  <button
                    type="button"
                    className="btn bg-white border-0"
                    onClick={() => setSearch("")}
                    title="Clear search"
                    style={{
                      boxShadow: "none",
                      outline: "none",
                    }}
                  >
                    <i className="bi bi-x-lg text-muted"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Patients Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-semibold">Patient List</h5>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>

              <p className="text-muted mt-2 mb-0">Loading patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-person-x fs-1 text-muted"></i>

              <p className="text-muted mt-3 mb-0">
                {search ? "No patients found." : "No consulted patients found."}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4">Patient ID</th>
                    <th>Patient Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Blood Group</th>
                    <th>Mobile</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="px-4 fw-semibold">{patient.patient_id}</td>

                      <td>{patient.patient_name}</td>

                      <td>{patient.age}</td>

                      <td>{patient.gender}</td>

                      <td>{patient.blood_group || "-"}</td>

                      <td>{patient.mobile_number}</td>

                      <td className="text-center">
                        <button
                          className="badge fs-6 btn btn-sm bg-warning-subtle text-warning"
                          onClick={() =>
                            navigate(`/doctor/patients/${patient.id}`)
                          }
                        >
                          <i className="bi bi-eye me-1"></i>
                          View
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
  );
}

export default DoctorPatientsHistroy;
