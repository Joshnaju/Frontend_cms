import { useEffect, useState } from "react";
import api from "../../services/api";

function MedicineInventory() {

  // Medicine master list
  const [medicines, setMedicines] = useState([]);

  // Inventory list
  const [inventoryList, setInventoryList] = useState([]);

  // Selected medicine
  const [selectedMedicineId, setSelectedMedicineId] =
    useState("");

  const [selectedMedicine, setSelectedMedicine] =
    useState(null);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");


  // ==========================================
  // LOAD MEDICINES AND INVENTORY
  // ==========================================

  useEffect(() => {

    loadMedicines();
    loadInventory();

  }, []);


  // ==========================================
  // LOAD MEDICINES
  // ==========================================

  async function loadMedicines() {

    try {

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

    }

  }


  // ==========================================
  // LOAD INVENTORY
  // ==========================================

  async function loadInventory() {

    try {

      setLoading(true);

      setError("");

      const response = await api.get(
        "pharmacy/medicine-inventory/"
      );

      console.log(
        "Inventory response:",
        response.data
      );

      setInventoryList(response.data);

    } catch (error) {

      console.error(
        "Error loading inventory:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Failed to load inventory."
      );

    } finally {

      setLoading(false);

    }

  }


  // ==========================================
  // SELECT MEDICINE
  // ==========================================

  async function handleSelectMedicine(e) {

    const medicineId = e.target.value;

    setSelectedMedicineId(medicineId);

    setSelectedMedicine(null);

    setMessage("");

    setError("");


    if (!medicineId) {

      return;

    }


    try {

      setLoading(true);


      const response = await api.get(
        `pharmacy/medicine/${medicineId}/`
      );


      console.log(
        "Selected medicine:",
        response.data
      );


      setSelectedMedicine(
        response.data
      );


    } catch (error) {

      console.error(
        "Error loading medicine details:",
        error
      );


      setError(
        error.response?.data?.detail ||
        "Failed to load medicine details."
      );


    } finally {

      setLoading(false);

    }

  }


  // ==========================================
  // HANDLE INVENTORY FIELD CHANGE
  // ==========================================

  function handleInventoryChange(e) {

    const {
      name,
      value
    } = e.target;


    setSelectedMedicine(
      (prev) => ({

        ...prev,

        inventory: {

          ...prev.inventory,

          [name]: value,

        },

      })
    );

  }


  // ==========================================
  // UPDATE EXISTING INVENTORY
  // ==========================================

  async function handleUpdateInventory() {

    if (!selectedMedicine) {

      return;

    }


    if (!selectedMedicine.inventory) {

      setError(
        "No inventory record exists for this medicine."
      );

      return;

    }


    try {

      setSaving(true);

      setError("");

      setMessage("");


      const medicineId =
        selectedMedicine.medicine_id ||
        selectedMedicine.id;


      const inventory =
        selectedMedicine.inventory;


      const updateData = {

        stock:
          Number(inventory.stock),

        min_stock:
          Number(inventory.min_stock),

        max_stock:
          Number(inventory.max_stock),

        batch_number:
          inventory.batch_number,

        manufacturing_date:
          inventory.manufacturing_date,

        expiry_date:
          inventory.expiry_date,

        number_of_units:
          Number(inventory.number_of_units),

      };


      console.log(
        "Updating inventory:",
        updateData
      );


      // PATCH updates the existing medicine/inventory
      const response = await api.patch(
        `pharmacy/medicine/${medicineId}/`,
        updateData
      );


      console.log(
        "Update response:",
        response.data
      );


      setSelectedMedicine(
        response.data
      );


      setMessage(
        "Medicine inventory updated successfully."
      );


      // Refresh inventory table
      await loadInventory();


    } catch (error) {

      console.error(
        "Update inventory error:",
        error
      );


      console.error(
        "Backend response:",
        error.response?.data
      );


      setError(
        error.response?.data?.detail ||
        "Failed to update medicine inventory."
      );


    } finally {

      setSaving(false);

    }

  }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading && medicines.length === 0) {

    return (

      <div className="container mt-4">

        <h3 className="text-center mt-5">

          Loading medicines...

        </h3>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="container mt-4">


      {/* =====================================
          PAGE TITLE
      ===================================== */}

      <h2 className="mb-4">

        Medicine Inventory

      </h2>


      {/* =====================================
          ERROR MESSAGE
      ===================================== */}

      {error && (

        <div className="alert alert-danger">

          {error}

        </div>

      )}


      {/* =====================================
          SUCCESS MESSAGE
      ===================================== */}

      {message && (

        <div className="alert alert-success">

          {message}

        </div>

      )}


      {/* =====================================
          SELECT MEDICINE
      ===================================== */}

      <div className="card shadow-sm mb-4">

        <div className="card-header">

          <strong>

            Select Medicine

          </strong>

        </div>


        <div className="card-body">

          <label className="form-label">

            Medicine

          </label>


          <select
            className="form-select"
            value={selectedMedicineId}
            onChange={handleSelectMedicine}
          >

            <option value="">

              Select an existing medicine

            </option>


            {medicines.map(
              (medicine) => (

                <option
                  key={medicine.id}
                  value={medicine.id}
                >

                  {medicine.name}

                </option>

              )
            )}

          </select>

        </div>

      </div>


      {/* =====================================
          SELECTED MEDICINE EDIT FORM
      ===================================== */}

      {selectedMedicine && (

        <div className="card shadow-sm mb-5">


          <div className="card-header">

            <strong>

              Edit Medicine Inventory

            </strong>

          </div>


          <div className="card-body">


            {/* =================================
                MEDICINE DETAILS
            ================================= */}

            <h5 className="mb-3">

              Medicine Details

            </h5>


            <div className="row">


              {/* MEDICINE ID */}

              <div className="col-md-4 mb-3">

                <label className="form-label">

                  Medicine ID

                </label>


                <input
                  type="text"
                  className="form-control"
                  value={
                    selectedMedicine.medicine_id ||
                    selectedMedicine.id ||
                    ""
                  }
                  readOnly
                />

              </div>


              {/* MEDICINE NAME */}

              <div className="col-md-4 mb-3">

                <label className="form-label">

                  Medicine Name

                </label>


                <input
                  type="text"
                  className="form-control"
                  value={
                    selectedMedicine.name ||
                    ""
                  }
                  readOnly
                />

              </div>


              {/* GENERIC NAME */}

              <div className="col-md-4 mb-3">

                <label className="form-label">

                  Generic Name

                </label>


                <input
                  type="text"
                  className="form-control"
                  value={
                    selectedMedicine.generic_name ||
                    ""
                  }
                  readOnly
                />

              </div>


              {/* DOSAGE FORM */}

              <div className="col-md-4 mb-3">

                <label className="form-label">

                  Dosage Form

                </label>


                <input
                  type="text"
                  className="form-control"
                  value={
                    selectedMedicine.dosage_form ||
                    ""
                  }
                  readOnly
                />

              </div>


              {/* STRENGTH */}

              <div className="col-md-4 mb-3">

                <label className="form-label">

                  Strength

                </label>


                <input
                  type="text"
                  className="form-control"
                  value={
                    selectedMedicine.strength ||
                    ""
                  }
                  readOnly
                />

              </div>


              {/* MANUFACTURER */}

              <div className="col-md-4 mb-3">

                <label className="form-label">

                  Manufacturer

                </label>


                <input
                  type="text"
                  className="form-control"
                  value={
                    selectedMedicine.manufacturer ||
                    ""
                  }
                  readOnly
                />

              </div>


              {/* PRICE */}

              <div className="col-md-4 mb-3">

                <label className="form-label">

                  Price

                </label>


                <input
                  type="text"
                  className="form-control"
                  value={
                    selectedMedicine.price ||
                    ""
                  }
                  readOnly
                />

              </div>


            </div>


            <hr />


            {/* =================================
                INVENTORY DETAILS
            ================================= */}

            <h5 className="mb-3">

              Inventory Details

            </h5>


            {selectedMedicine.inventory ? (

              <div className="row">


                {/* STOCK */}

                <div className="col-md-4 mb-3">

                  <label className="form-label">

                    Current Stock

                  </label>


                  <input
                    type="number"
                    className="form-control"
                    name="stock"
                    min="0"
                    value={
                      selectedMedicine.inventory.stock ??
                      ""
                    }
                    onChange={
                      handleInventoryChange
                    }
                  />

                </div>


                {/* MIN STOCK */}

                <div className="col-md-4 mb-3">

                  <label className="form-label">

                    Minimum Stock

                  </label>


                  <input
                    type="number"
                    className="form-control"
                    name="min_stock"
                    min="0"
                    value={
                      selectedMedicine.inventory.min_stock ??
                      ""
                    }
                    onChange={
                      handleInventoryChange
                    }
                  />

                </div>


                {/* MAX STOCK */}

                <div className="col-md-4 mb-3">

                  <label className="form-label">

                    Maximum Stock

                  </label>


                  <input
                    type="number"
                    className="form-control"
                    name="max_stock"
                    min="0"
                    value={
                      selectedMedicine.inventory.max_stock ??
                      ""
                    }
                    onChange={
                      handleInventoryChange
                    }
                  />

                </div>


                {/* BATCH NUMBER */}

                <div className="col-md-4 mb-3">

                  <label className="form-label">

                    Batch Number

                  </label>


                  <input
                    type="text"
                    className="form-control"
                    name="batch_number"
                    value={
                      selectedMedicine.inventory.batch_number ||
                      ""
                    }
                    onChange={
                      handleInventoryChange
                    }
                  />

                </div>


                {/* MANUFACTURING DATE */}

                <div className="col-md-4 mb-3">

                  <label className="form-label">

                    Manufacturing Date

                  </label>


                  <input
                    type="date"
                    className="form-control"
                    name="manufacturing_date"
                    value={
                      selectedMedicine.inventory.manufacturing_date ||
                      ""
                    }
                    onChange={
                      handleInventoryChange
                    }
                  />

                </div>


                {/* EXPIRY DATE */}

                <div className="col-md-4 mb-3">

                  <label className="form-label">

                    Expiry Date

                  </label>


                  <input
                    type="date"
                    className="form-control"
                    name="expiry_date"
                    value={
                      selectedMedicine.inventory.expiry_date ||
                      ""
                    }
                    onChange={
                      handleInventoryChange
                    }
                  />

                </div>


                {/* NUMBER OF UNITS */}

                <div className="col-md-4 mb-3">

                  <label className="form-label">

                    Number of Units

                  </label>


                  <input
                    type="number"
                    className="form-control"
                    name="number_of_units"
                    min="1"
                    value={
                      selectedMedicine.inventory.number_of_units ??
                      ""
                    }
                    onChange={
                      handleInventoryChange
                    }
                  />

                </div>


                {/* UPDATE BUTTON */}

                <div className="col-12 mt-3">

                  <button
                    type="button"
                    className="btn text-white"
                    style={{
                      backgroundColor: "#1976A3"
                    }}
                    onClick={
                      handleUpdateInventory
                    }
                    disabled={saving}
                  >

                    {saving
                      ? "Updating..."
                      : "Update Inventory"}

                  </button>

                </div>


              </div>

            ) : (

              <div className="alert alert-warning">

                No inventory record exists
                for this medicine.

              </div>

            )}

          </div>

        </div>

      )}


      {/* =====================================
          INVENTORY TABLE
      ===================================== */}

      <div className="card shadow-sm mb-5">


        <div className="card-header">

          <strong>

            Medicine Inventory Details

          </strong>

        </div>


        <div className="card-body p-0">


          <div className="table-responsive">


            <table className="table table-bordered table-hover mb-0">


              <thead className="table-light">

                <tr>

                  <th>
                    Inventory ID
                  </th>

                  <th>
                    Medicine
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
                    Stock
                  </th>

                  <th>
                    Min Stock
                  </th>

                  <th>
                    Max Stock
                  </th>

                  <th>
                    Batch Number
                  </th>

                  <th>
                    Manufacturing Date
                  </th>

                  <th>
                    Expiry Date
                  </th>

                  <th>
                    Number of Units
                  </th>

                </tr>

              </thead>


              <tbody>


                {inventoryList.length > 0 ? (

                  inventoryList.map(
                    (inventory) => (

                      <tr
                        key={inventory.id}
                      >


                        {/* INVENTORY ID */}

                        <td>

                          {inventory.id}

                        </td>


                        {/* MEDICINE */}

                        <td>

                          {inventory.medicine_name ||
                           inventory.medicine ||
                           "-"}

                        </td>


                        {/* GENERIC NAME */}

                        <td>

                          {inventory.generic_name ||
                           "-"}

                        </td>


                        {/* DOSAGE FORM */}

                        <td>

                          {inventory.dosage_form ||
                           "-"}

                        </td>


                        {/* STRENGTH */}

                        <td>

                          {inventory.strength ||
                           "-"}

                        </td>


                        {/* MANUFACTURER */}

                        <td>

                          {inventory.manufacturer ||
                           "-"}

                        </td>


                        {/* PRICE */}

                        <td>

                          ₹ {inventory.price ?? "0.00"}

                        </td>


                        {/* STOCK */}

                        <td>

                          {inventory.stock ?? "-"}

                        </td>


                        {/* MIN STOCK */}

                        <td>

                          {inventory.min_stock ?? "-"}

                        </td>


                        {/* MAX STOCK */}

                        <td>

                          {inventory.max_stock ?? "-"}

                        </td>


                        {/* BATCH */}

                        <td>

                          {inventory.batch_number ||
                           "-"}

                        </td>


                        {/* MANUFACTURING DATE */}

                        <td>

                          {inventory.manufacturing_date ||
                           "-"}

                        </td>


                        {/* EXPIRY DATE */}

                        <td>

                          {inventory.expiry_date ||
                           "-"}

                        </td>


                        {/* NUMBER OF UNITS */}

                        <td>

                          {inventory.number_of_units ??
                           "-"}

                        </td>


                      </tr>

                    )

                  )

                ) : (

                  <tr>

                    <td
                      colSpan="14"
                      className="text-center py-3"
                    >

                      No inventory records found.

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

export default MedicineInventory;