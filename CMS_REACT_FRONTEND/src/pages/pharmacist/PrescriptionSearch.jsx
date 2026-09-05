import { useState } from "react";
import api from "../../services/api";

function PrescriptionSearch() {
  const [prescriptions, setPrescriptions] = useState([]);

  const [searchType, setSearchType] =
    useState("patient_id");

  const [searchValue, setSearchValue] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSearch = async () => {
    setError("");

    if (!searchValue.trim()) {
      setError("Please enter a search value.");
      setPrescriptions([]);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        "pharmacy/prescriptions/",
        {
          params: {
            [searchType]: searchValue.trim(),
          },
        }
      );

      setPrescriptions(response.data);

    } catch (error) {
      console.error(
        "Prescription search error:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Failed to search prescriptions."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setPrescriptions([]);
    setError("");
  };

  return (
    <div>
      <h2 className="mb-4">
        Prescription Search
      </h2>

      {/* SEARCH SECTION */}

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <div className="row g-3">

            {/* SEARCH TYPE */}

            <div className="col-md-3">

              <label className="form-label">
                Search By
              </label>

              <select
                className="form-select"
                value={searchType}
                onChange={(e) =>
                  setSearchType(e.target.value)
                }
              >
                <option value="patient_id">
                  Patient ID
                </option>

                <option value="patient_name">
                  Patient Name
                </option>

                <option value="doctor_name">
                  Doctor Name
                </option>

              </select>

            </div>


            {/* SEARCH VALUE */}

            <div className="col-md-5">

              <label className="form-label">
                Search
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Enter search value"
                value={searchValue}
                onChange={(e) =>
                  setSearchValue(e.target.value)
                }
              />

            </div>


            {/* BUTTONS */}

            <div className="col-md-4 d-flex align-items-end">

              <button
                className="btn text-white me-2"
                style={{
                  backgroundColor: "#1976A3",
                }}
                onClick={handleSearch}
              >
                Search
              </button>


              <button
                className="btn btn-secondary"
                onClick={handleClear}
              >
                Clear
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* ERROR */}

      {error && (

        <div className="alert alert-danger">
          {error}
        </div>

      )}


      {/* LOADING */}

      {loading && (

        <div className="text-center">

          <div
            className="spinner-border"
            role="status"
          />

        </div>

      )}


      {/* PRESCRIPTION TABLE */}

      {!loading && prescriptions.length > 0 && (

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead className="table-light">

              <tr>

                <th>Prescription ID</th>

                <th>Patient ID</th>

                <th>Patient Name</th>

                <th>Doctor</th>

                <th>Medicine</th>

                <th>Dosage</th>

                <th>Frequency</th>

                <th>Duration</th>

                <th>Instructions</th>

              </tr>

            </thead>


            <tbody>

              {prescriptions.map(
                (prescription) => (

                  <tr
                    key={prescription.id}
                  >

                    <td>
                      {prescription.id}
                    </td>

                    <td>
                      {prescription.patient_id}
                    </td>

                    <td>
                      {prescription.patient_name}
                    </td>

                    <td>
                      {prescription.doctor_name}
                    </td>

                    <td>
                      {prescription.medicine_name}
                    </td>

                    <td>
                      {prescription.dosage}
                    </td>

                    <td>
                      {prescription.frequency}
                    </td>

                    <td>
                      {prescription.duration}
                    </td>

                    <td>
                      {prescription.instructions || "-"}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}


      {/* NO RESULTS */}

      {!loading &&
        prescriptions.length === 0 &&
        !error && (

          <div className="text-muted">

            Search for a patient or doctor to view prescriptions.

          </div>

        )}

    </div>
  );
}

export default PrescriptionSearch;