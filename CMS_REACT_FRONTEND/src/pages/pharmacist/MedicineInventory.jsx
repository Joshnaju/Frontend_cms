import { useEffect, useState } from "react";
import api from "../../services/api";

function MedicineInventory() {

  const [medicines, setMedicines] = useState([]);

  const [inventories, setInventories] = useState([]);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    medicine: "",
    stock: "",
    min_stock: "",
    max_stock: "",
    batch_number: "",
    manufacturing_date: "",
    expiry_date: "",
    number_of_units: "",
  });


  // ==============================
  // LOAD MEDICINES
  // ==============================

  useEffect(() => {

    loadMedicines();

    loadInventories();

  }, []);


  // ==============================
  // GET MEDICINES
  // ==============================

  const loadMedicines = async () => {

    try {

      const response = await api.get(
        "medicine-master/medicines/"
      );

      setMedicines(response.data);

    } catch (error) {

      console.error(error);

      setError(
        "Failed to load medicines."
      );

    }

  };


  // ==============================
  // GET INVENTORY
  // ==============================

  const loadInventories = async () => {

    try {

      setLoading(true);

      const response = await api.get(
        "pharmacy/medicine-inventory/"
      );

      setInventories(
        response.data
      );

    } catch (error) {

      console.error(error);

      setError(
        "Failed to load inventory."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==============================
  // HANDLE INPUT CHANGE
  // ==============================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData({
      ...formData,

      [name]: value,
    });

  };


  // ==============================
  // ADD INVENTORY
  // ==============================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setMessage("");


    try {

      setLoading(true);


      const inventoryData = {

        medicine:
          Number(formData.medicine),

        stock:
          Number(formData.stock),

        min_stock:
          Number(formData.min_stock),

        max_stock:
          Number(formData.max_stock),

        batch_number:
          formData.batch_number,

        manufacturing_date:
          formData.manufacturing_date,

        expiry_date:
          formData.expiry_date,

        number_of_units:
          Number(formData.number_of_units),

      };


      await api.post(
        "pharmacy/medicine-inventory/",
        inventoryData
      );


      setMessage(
        "Medicine inventory added successfully."
      );


      // Reset form

      setFormData({
        medicine: "",
        stock: "",
        min_stock: "",
        max_stock: "",
        batch_number: "",
        manufacturing_date: "",
        expiry_date: "",
        number_of_units: "",
      });


      // Reload inventory

      loadInventories();


    } catch (error) {

      console.error(error);


      setError(
        error.response?.data?.detail ||
        "Failed to add inventory."
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="container mt-4">


      {/* ==============================
          PAGE TITLE
      ============================== */}

      <h2 className="mb-4">

        Medicine Inventory

      </h2>


      {/* ==============================
          ERROR MESSAGE
      ============================== */}

      {error && (

        <div className="alert alert-danger">

          {error}

        </div>

      )}


      {/* ==============================
          SUCCESS MESSAGE
      ============================== */}

      {message && (

        <div className="alert alert-success">

          {message}

        </div>

      )}


      {/* ==============================
          ADD INVENTORY FORM
      ============================== */}

      <div className="card shadow-sm mb-4">


        <div className="card-header">

          <strong>

            Add Medicine Inventory

          </strong>

        </div>


        <div className="card-body">


          <form
            onSubmit={handleSubmit}
          >


            <div className="row g-3">


              {/* MEDICINE */}

              <div className="col-md-6">

                <label className="form-label">

                  Medicine

                </label>


                <select
                  name="medicine"
                  className="form-select"
                  value={
                    formData.medicine
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">

                    Select Medicine

                  </option>


                  {medicines.map(
                    (medicine) => (

                      <option
                        key={
                          medicine.id
                        }
                        value={
                          medicine.id
                        }
                      >

                        {medicine.name}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* CURRENT STOCK */}

              <div className="col-md-6">

                <label className="form-label">

                  Current Stock

                </label>


                <input
                  type="number"
                  name="stock"
                  min="0"
                  className="form-control"
                  value={
                    formData.stock
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* MIN STOCK */}

              <div className="col-md-4">

                <label className="form-label">

                  Minimum Stock

                </label>


                <input
                  type="number"
                  name="min_stock"
                  min="0"
                  className="form-control"
                  value={
                    formData.min_stock
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* MAX STOCK */}

              <div className="col-md-4">

                <label className="form-label">

                  Maximum Stock

                </label>


                <input
                  type="number"
                  name="max_stock"
                  min="0"
                  className="form-control"
                  value={
                    formData.max_stock
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* NUMBER OF UNITS */}

              <div className="col-md-4">

                <label className="form-label">

                  Number of Units

                </label>


                <input
                  type="number"
                  name="number_of_units"
                  min="0"
                  className="form-control"
                  value={
                    formData.number_of_units
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* BATCH NUMBER */}

              <div className="col-md-6">

                <label className="form-label">

                  Batch Number

                </label>


                <input
                  type="text"
                  name="batch_number"
                  className="form-control"
                  value={
                    formData.batch_number
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* MANUFACTURING DATE */}

              <div className="col-md-3">

                <label className="form-label">

                  Manufacturing Date

                </label>


                <input
                  type="date"
                  name="manufacturing_date"
                  className="form-control"
                  value={
                    formData.manufacturing_date
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* EXPIRY DATE */}

              <div className="col-md-3">

                <label className="form-label">

                  Expiry Date

                </label>


                <input
                  type="date"
                  name="expiry_date"
                  className="form-control"
                  value={
                    formData.expiry_date
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* BUTTON */}

              <div className="col-12 text-end">

                <button
                  type="submit"
                  className="btn text-white"
                  style={{
                    backgroundColor:
                      "#1976A3"
                  }}
                  disabled={
                    loading
                  }
                >

                  Add Inventory

                </button>

              </div>


            </div>


          </form>


        </div>


      </div>


      {/* ==============================
          INVENTORY LIST
      ============================== */}

      <div className="card shadow-sm">


        <div className="card-header">

          <strong>

            Inventory List

          </strong>

        </div>


        <div className="card-body p-0">


          {loading ? (

            <div className="text-center p-4">

              Loading...

            </div>

          ) : (

            <div className="table-responsive">


              <table className="table table-bordered mb-0">


                <thead className="table-light">

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Medicine
                    </th>

                    <th>
                      Stock
                    </th>

                    <th>
                      Min Stock
                    </th>

                    <th>
                      Max Stock
                    </th>

                    <th>
                      Batch
                    </th>

                    <th>
                      Manufacturing
                    </th>

                    <th>
                      Expiry
                    </th>

                    <th>
                      Units
                    </th>

                  </tr>

                </thead>


                <tbody>


                  {inventories.length > 0 ? (

                    inventories.map(
                      (inventory) => (

                        <tr
                          key={
                            inventory.id
                          }
                        >

                          <td>
                            {
                              inventory.id
                            }
                          </td>


                          <td>

                            {
                              inventory.medicine_name ||
                              inventory.medicine
                            }

                          </td>


                          <td>
                            {
                              inventory.stock
                            }
                          </td>


                          <td>
                            {
                              inventory.min_stock
                            }
                          </td>


                          <td>
                            {
                              inventory.max_stock
                            }
                          </td>


                          <td>
                            {
                              inventory.batch_number
                            }
                          </td>


                          <td>
                            {
                              inventory.manufacturing_date
                            }
                          </td>


                          <td>
                            {
                              inventory.expiry_date
                            }
                          </td>


                          <td>
                            {
                              inventory.number_of_units
                            }
                          </td>


                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="9"
                        className="text-center"
                      >

                        No inventory records found.

                      </td>

                    </tr>

                  )}


                </tbody>


              </table>


            </div>

          )}


        </div>


      </div>


    </div>

  );

}

export default MedicineInventory;