import { useEffect, useState } from "react";
import api from "../../services/api";

function MedicineList() {

  const [medicines, setMedicines] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =================================
  // LOAD MEDICINES
  // =================================

  useEffect(() => {

    loadMedicines();

  }, []);


  async function loadMedicines() {

    try {

      setLoading(true);

      setError("");

      const response = await api.get(
        "medicine-master/medicines/"
      );

      setMedicines(response.data);

    } catch (error) {

      console.error(
        "Error loading medicines:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Failed to load medicines."
      );

    } finally {

      setLoading(false);

    }

  }


  // =================================
  // LOADING
  // =================================

  if (loading) {

    return (

      <div className="container mt-4">

        <h3 className="text-center mt-5">

          Loading medicines...

        </h3>

      </div>

    );

  }


  // =================================
  // PAGE
  // =================================

  return (

    <div className="container mt-4">


      {/* =================================
          TITLE
      ================================= */}

      <h2 className="mb-4">

        Medicine List

      </h2>


      {/* =================================
          ERROR
      ================================= */}

      {error && (

        <div className="alert alert-danger">

          {error}

        </div>

      )}


      {/* =================================
          MEDICINE LIST
      ================================= */}

      <div className="card shadow-sm">

        <div className="card-header">

          <strong>

            Available Medicines

          </strong>

        </div>


        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-bordered table-hover mb-0">

              <thead className="table-light">

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Medicine Name
                  </th>

                  <th>
                    Generic Name
                  </th>

                  <th>
                    Dosage Form
                  </th>

                  <th>
                    Strength
                  </th>

                  <th>
                    Manufacturer
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {medicines.length > 0 ? (

                  medicines.map(
                    (medicine) => (

                      <tr
                        key={medicine.id}
                      >

                        <td>

                          {medicine.id}

                        </td>


                        <td>

                          {medicine.name}

                        </td>


                        <td>

                          {medicine.generic_name || "-"}

                        </td>


                        <td>

                          {medicine.dosage_form || "-"}

                        </td>


                        <td>

                          {medicine.strength || "-"}

                        </td>


                        <td>

                          {medicine.manufacturer || "-"}

                        </td>


                        <td>

                          ₹ {medicine.price}

                        </td>


                        <td>

                          {medicine.is_active
                            ? "Active"
                            : "Inactive"}

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="8"
                      className="text-center"
                    >

                      No medicines found.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>


    </div>

  );

}

export default MedicineList;