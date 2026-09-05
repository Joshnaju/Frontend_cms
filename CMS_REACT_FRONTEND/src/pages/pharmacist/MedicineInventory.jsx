import { useEffect, useState } from "react";
import api from "../../services/api";

function MedicineInventory() {
  const [medicines, setMedicines] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);

  const [selectedMedicineId, setSelectedMedicineId] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD MEDICINES AND INVENTORY WHEN PAGE OPENS
  // --------------------------------------------------
  useEffect(() => {
    loadMedicines();
    loadInventory();
  }, []);

  // --------------------------------------------------
  // LOAD ALL MEDICINES
  // --------------------------------------------------
  async function loadMedicines() {
    try {
      setError("");

      const response = await api.get(
        "medicine-master/medicines/"
      );

      console.log("Medicine response:", response.data);

      setMedicines(response.data);
    } catch (error) {
      console.error("Error loading medicines:", error);

      setError(
        error.response?.data?.detail ||
        "Failed to load medicines."
      );
    }
  }

  // --------------------------------------------------
  // LOAD INVENTORY
  //
  // IMPORTANT:
  // Medicine and MedicineInventory are separate tables.
  //
  // So we combine:
  // 1. All medicines
  // 2. Existing inventory records
  //
  // This allows medicines without inventory to also
  // appear in the Inventory page.
  // --------------------------------------------------
  async function loadInventory() {
    try {
      setLoading(true);
      setError("");

      // Get all medicines
      const medicineResponse = await api.get(
        "medicine-master/medicines/"
      );

      // Get existing inventory records
      const inventoryResponse = await api.get(
        "pharmacy/medicine-inventory/"
      );

      console.log(
        "Medicine list:",
        medicineResponse.data
      );

      console.log(
        "Inventory list:",
        inventoryResponse.data
      );

      const medicineData = medicineResponse.data;
      const inventoryData = inventoryResponse.data;

      // Combine medicine + inventory
      const mergedInventory = medicineData.map(
        (medicine) => {
          // Find inventory record for this medicine
          const inventory = inventoryData.find(
            (item) =>
              Number(item.medicine) ===
              Number(medicine.id)
          );

          // If inventory exists
          if (inventory) {
            return {
              ...inventory,

              medicine_name:
                inventory.medicine_name ||
                medicine.name,

              generic_name:
                inventory.generic_name ||
                medicine.generic_name,

              dosage_form:
                inventory.dosage_form ||
                medicine.dosage_form,

              strength:
                inventory.strength ||
                medicine.strength,

              manufacturer:
                inventory.manufacturer ||
                medicine.manufacturer,

              price:
                inventory.price ??
                medicine.price,

              inventory_exists: true,
            };
          }

          // If inventory DOES NOT exist
          // create a temporary frontend record
          return {
            id: `medicine-${medicine.id}`,

            medicine: medicine.id,

            medicine_name: medicine.name,

            generic_name:
              medicine.generic_name,

            dosage_form:
              medicine.dosage_form,

            strength:
              medicine.strength,

            manufacturer:
              medicine.manufacturer,

            price: medicine.price,

            stock: null,
            min_stock: null,
            max_stock: null,

            batch_number: null,

            manufacturing_date: null,

            expiry_date: null,

            number_of_units: null,

            inventory_exists: false,
          };
        }
      );

      console.log(
        "Merged inventory:",
        mergedInventory
      );

      setInventoryList(mergedInventory);
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

  // --------------------------------------------------
  // SELECT MEDICINE
  // --------------------------------------------------
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

      const medicineData = response.data;

      // If inventory exists, use it.
      //
      // If inventory does not exist,
      // create an empty inventory object
      // so the user can enter the details.
      setSelectedMedicine({
        ...medicineData,

        inventory:
          medicineData.inventory || {
            stock: "",
            min_stock: "",
            max_stock: "",
            batch_number: "",
            manufacturing_date: "",
            expiry_date: "",
            number_of_units: "",
          },
      });
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

  // --------------------------------------------------
  // HANDLE INVENTORY INPUT CHANGES
  // --------------------------------------------------
  function handleInventoryChange(e) {
    const { name, value } = e.target;

    setSelectedMedicine((prev) => ({
      ...prev,

      inventory: {
        ...prev.inventory,

        [name]: value,
      },
    }));
  }

  // --------------------------------------------------
  // SAVE / UPDATE INVENTORY
  // --------------------------------------------------
  async function handleUpdateInventory() {
    if (!selectedMedicine) {
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

      // --------------------------------------------------
      // VALIDATION
      // --------------------------------------------------

      if (
        inventory.stock === "" ||
        inventory.stock === null ||
        inventory.stock === undefined
      ) {
        setError("Please enter current stock.");
        setSaving(false);
        return;
      }

      if (
        inventory.min_stock === "" ||
        inventory.min_stock === null ||
        inventory.min_stock === undefined
      ) {
        setError("Please enter minimum stock.");
        setSaving(false);
        return;
      }

      if (
        inventory.max_stock === "" ||
        inventory.max_stock === null ||
        inventory.max_stock === undefined
      ) {
        setError("Please enter maximum stock.");
        setSaving(false);
        return;
      }

      if (!inventory.batch_number) {
        setError("Please enter batch number.");
        setSaving(false);
        return;
      }

      if (!inventory.manufacturing_date) {
        setError(
          "Please enter manufacturing date."
        );
        setSaving(false);
        return;
      }

      if (!inventory.expiry_date) {
        setError("Please enter expiry date.");
        setSaving(false);
        return;
      }

      if (
        inventory.number_of_units === "" ||
        inventory.number_of_units === null ||
        inventory.number_of_units === undefined
      ) {
        setError(
          "Please enter number of units."
        );
        setSaving(false);
        return;
      }

      // --------------------------------------------------
      // DATA TO SEND TO BACKEND
      // --------------------------------------------------

      const updateData = {
  medicine: Number(medicineId),

  stock: Number(inventory.stock),

  min_stock: Number(inventory.min_stock),

  max_stock: Number(inventory.max_stock),

  batch_number: inventory.batch_number,

  manufacturing_date:
    inventory.manufacturing_date,

  expiry_date:
    inventory.expiry_date,

  number_of_units:
    Number(inventory.number_of_units),
};

      console.log(
        "Saving inventory:",
        JSON.stringify(updateData, null, 2)
        );

      // --------------------------------------------------
      // PATCH MEDICINE DETAILS
      //
      // Backend will:
      // - UPDATE inventory if it exists
      // - CREATE inventory if it does not exist
      // --------------------------------------------------

      const response = await api.patch(
        `pharmacy/medicine/${medicineId}/`,
        updateData
      );

      console.log(
        "Save response:",
        response.data
      );

      // --------------------------------------------------
      // GET UPDATED DATA
      //
      // PATCH response only contains:
      // message + medicine_id
      //
      // So we call GET again to get the full details.
      // --------------------------------------------------

      const detailsResponse =
        await api.get(
          `pharmacy/medicine/${medicineId}/`
        );

      console.log(
        "Updated medicine:",
        detailsResponse.data
      );

      setSelectedMedicine(
        detailsResponse.data
      );

      setMessage(
        "Medicine inventory saved successfully."
      );

      // Reload inventory table
      await loadInventory();
    } catch (error) {
      console.error(
        "Save inventory error:",
        error
      );

      console.error(
        "Backend response:",
        JSON.stringify(error.response?.data, null, 2)
        );

      setError(
        error.response?.data?.detail ||
        "Failed to save medicine inventory."
      );
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <div className="container-fluid p-4">

      {/* PAGE TITLE */}
      <div className="mb-4">
        <h2>Medicine Inventory</h2>

        <p className="text-muted">
          Manage medicine stock and inventory details.
        </p>
      </div>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* --------------------------------------------------
          MEDICINE SELECTOR
      -------------------------------------------------- */}
      <div className="card mb-4">
        <div className="card-body">

          <h5 className="card-title mb-3">
            Select Medicine
          </h5>

          <div className="row">

            <div className="col-md-6">

              <label className="form-label">
                Medicine
              </label>

              <select
                className="form-select"
                value={selectedMedicineId}
                onChange={handleSelectMedicine}
              >
                <option value="">
                  -- Select Medicine --
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

        </div>
      </div>

      {/* --------------------------------------------------
          LOADING
      -------------------------------------------------- */}
      {loading && (
        <div className="text-center mb-4">
          <div
            className="spinner-border"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>
        </div>
      )}

      {/* --------------------------------------------------
          SELECTED MEDICINE DETAILS
      -------------------------------------------------- */}
      {selectedMedicine && (
        <div className="card mb-4">

          <div className="card-body">

            <h5 className="card-title mb-4">
              Medicine Details
            </h5>

            {/* MEDICINE DETAILS */}
            <div className="row">

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

            {/* --------------------------------------------------
                INVENTORY DETAILS
            -------------------------------------------------- */}

            <h5 className="mb-4">
              Inventory Details
            </h5>

            <div className="row">

              {/* CURRENT STOCK */}
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
                    selectedMedicine.inventory?.stock ??
                    ""
                  }
                  onChange={
                    handleInventoryChange
                  }
                />

              </div>

              {/* MINIMUM STOCK */}
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
                    selectedMedicine.inventory?.min_stock ??
                    ""
                  }
                  onChange={
                    handleInventoryChange
                  }
                />

              </div>

              {/* MAXIMUM STOCK */}
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
                    selectedMedicine.inventory?.max_stock ??
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
                    selectedMedicine.inventory?.batch_number ??
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
                    selectedMedicine.inventory?.manufacturing_date ??
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
                    selectedMedicine.inventory?.expiry_date ??
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
                    selectedMedicine.inventory?.number_of_units ??
                    ""
                  }
                  onChange={
                    handleInventoryChange
                  }
                />

              </div>

              {/* SAVE BUTTON */}
              <div className="col-12 mt-3">

                <button
                  type="button"
                  className="btn text-white"
                  style={{
                    backgroundColor:
                      "#1976A3",
                  }}
                  onClick={
                    handleUpdateInventory
                  }
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Inventory"}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* --------------------------------------------------
          INVENTORY TABLE
      -------------------------------------------------- */}
      <div className="card">

        <div className="card-body">

          <h5 className="card-title mb-4">
            Medicine Inventory List
          </h5>

          {inventoryList.length === 0 ? (
            <div className="alert alert-info">
              No medicines found.
            </div>
          ) : (
            <div className="table-responsive">

              <table className="table table-bordered table-hover">

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

                  {inventoryList.map(
                    (inventory) => (
                      <tr
                        key={inventory.id}
                      >

                        {/* INVENTORY ID */}
                        <td>
                          {inventory.inventory_exists ===
                          false
                            ? "-"
                            : inventory.id}
                        </td>

                        {/* MEDICINE */}
                        <td>

                          <strong>
                            {inventory.medicine_name ||
                              inventory.medicine ||
                              "-"}
                          </strong>

                          {inventory.inventory_exists ===
                            false && (
                            <span className="badge bg-warning text-dark ms-2">
                              Inventory Not Added
                            </span>
                          )}

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
                          {inventory.price !==
                            null &&
                          inventory.price !==
                            undefined
                            ? `₹${inventory.price}`
                            : "-"}
                        </td>

                        {/* STOCK */}
                        <td>
                          {inventory.stock !==
                            null &&
                          inventory.stock !==
                            undefined
                            ? inventory.stock
                            : "-"}
                        </td>

                        {/* MIN STOCK */}
                        <td>
                          {inventory.min_stock !==
                            null &&
                          inventory.min_stock !==
                            undefined
                            ? inventory.min_stock
                            : "-"}
                        </td>

                        {/* MAX STOCK */}
                        <td>
                          {inventory.max_stock !==
                            null &&
                          inventory.max_stock !==
                            undefined
                            ? inventory.max_stock
                            : "-"}
                        </td>

                        {/* BATCH NUMBER */}
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
                          {inventory.number_of_units !==
                            null &&
                          inventory.number_of_units !==
                            undefined
                            ? inventory.number_of_units
                            : "-"}
                        </td>

                      </tr>
                    )
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