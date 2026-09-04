import { useEffect, useState } from "react";
import api from "../../services/api";

function MedicineList() {

  const [medicines, setMedicines] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedMedicine, setSelectedMedicine] =
    useState(null);

  const [inventoryLoading, setInventoryLoading] =
    useState(false);


  // =================================
  // LOAD MEDICINES
  // =================================

  useEffect(() => {

    getMedicines();

  }, []);


  async function getMedicines() {

    try {

      const response = await api.get(
        "medicine-master/medicines/"
      );

      setMedicines(
        response.data
      );

    } catch (error) {

      console.error(error);

      setError(
        "Failed to load medicines"
      );

    } finally {

      setLoading(false);

    }

  }


  // =================================
  // VIEW INVENTORY
  // =================================

  async function handleViewInventory(
    medicineId
  ) {

    try {

      setInventoryLoading(true);

      setError("");

      const response = await api.get(
        `pharmacy/medicine/${medicineId}/`
      );

      setSelectedMedicine(
        response.data
      );

    } catch (error) {

      console.error(
        "Inventory Error:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Failed to load inventory details"
      );

    } finally {

      setInventoryLoading(false);

    }

  }


  // =================================
  // MAIN MEDICINE LOADING
  // =================================

  if (loading) {

    return (

      <h3 className="text-center mt-5">

        Loading medicines...

      </h3>

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
          INVENTORY LOADING
      ================================= */}

      {inventoryLoading && (

        <div className="text-center mb-3">

          <div
            className="spinner-border"
            role="status"
          />

        </div>

      )}


      {/* =================================
          INVENTORY DETAILS
      ================================= */}

      {selectedMedicine && (

        <div className="card shadow-sm mb-4">


          <div className="card-header">

            <strong>

              Inventory Details

            </strong>

          </div>


          <div className="card-body">


            {/* =========================
                MEDICINE DETAILS
            ========================= */}

            <div className="row">


              <div className="col-md-4 mb-3">

                <strong>

                  Medicine:

                </strong>

                <p>

                  {selectedMedicine.name}

                </p>

              </div>


              <div className="col-md-4 mb-3">

                <strong>

                  Medicine ID:

                </strong>

                <p>

                  {selectedMedicine.medicine_id}

                </p>

              </div>


              <div className="col-md-4 mb-3">

                <strong>

                  Price:

                </strong>

                <p>

                  ₹ {selectedMedicine.price}

                </p>

              </div>


            </div>


            {/* =========================
                INVENTORY DATA
            ========================= */}

            {selectedMedicine.inventory ? (

              <div className="row">


                <div className="col-md-4 mb-3">

                  <strong>

                    Current Stock:

                  </strong>

                  <p>

                    {
                      selectedMedicine.inventory.stock
                    }

                  </p>

                </div>


                <div className="col-md-4 mb-3">

                  <strong>

                    Minimum Stock:

                  </strong>

                  <p>

                    {
                      selectedMedicine.inventory.min_stock
                    }

                  </p>

                </div>


                <div className="col-md-4 mb-3">

                  <strong>

                    Maximum Stock:

                  </strong>

                  <p>

                    {
                      selectedMedicine.inventory.max_stock
                    }

                  </p>

                </div>


                <div className="col-md-4 mb-3">

                  <strong>

                    Batch Number:

                  </strong>

                  <p>

                    {
                      selectedMedicine.inventory.batch_number
                    }

                  </p>

                </div>


                <div className="col-md-4 mb-3">

                  <strong>

                    Manufacturing Date:

                  </strong>

                  <p>

                    {
                      selectedMedicine.inventory.manufacturing_date
                    }

                  </p>

                </div>


                <div className="col-md-4 mb-3">

                  <strong>

                    Expiry Date:

                  </strong>

                  <p>

                    {
                      selectedMedicine.inventory.expiry_date
                    }

                  </p>

                </div>


                <div className="col-md-4 mb-3">

                  <strong>

                    Number of Units:

                  </strong>

                  <p>

                    {
                      selectedMedicine.inventory.number_of_units
                    }

                  </p>

                </div>


              </div>

            ) : (

              <div className="alert alert-warning">

                No inventory details available
                for this medicine.

              </div>

            )}


          </div>

        </div>

      )}


      {/* =================================
          MEDICINE TABLE
      ================================= */}

      <div className="table-responsive">

        <table className="table table-bordered table-hover">


          <thead>

            <tr>

              <th>ID</th>

              <th>Name</th>

              <th>Generic Name</th>

              <th>Dosage Form</th>

              <th>Strength</th>

              <th>Manufacturer</th>

              <th>Price</th>

              <th>Status</th>

              <th>View</th>

            </tr>

          </thead>


          <tbody>


            {medicines.map(
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

                    {medicine.generic_name}

                  </td>


                  <td>

                    {medicine.dosage_form}

                  </td>


                  <td>

                    {medicine.strength}

                  </td>


                  <td>

                    {medicine.manufacturer}

                  </td>


                  <td>

                    ₹ {medicine.price}

                  </td>


                  <td>

                    {
                      medicine.is_active
                        ? "Active"
                        : "Inactive"
                    }

                  </td>


                  {/* VIEW INVENTORY BUTTON */}

                  <td>

                    <button

                      className="btn btn-sm text-white"

                      style={{
                        backgroundColor:
                          "#1976A3",
                      }}

                      onClick={() =>

                        handleViewInventory(
                          medicine.id
                        )

                      }

                    >

                      View Inventory

                    </button>

                  </td>


                </tr>

              )
            )}


          </tbody>


        </table>

      </div>


    </div>

  );

}

export default MedicineList;