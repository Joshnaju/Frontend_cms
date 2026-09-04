import { useState } from "react";
import api from "../../services/api";

function PharmacyBills() {
  const [patientId, setPatientId] = useState("");

  const [prescriptions, setPrescriptions] =
    useState([]);

  const [selectedItems, setSelectedItems] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [createdBill, setCreatedBill] =
    useState(null);


  // ===============================
  // SEARCH PRESCRIPTIONS
  // ===============================

  const handleSearch = async () => {

    setError("");
    setMessage("");
    setPrescriptions([]);
    setSelectedItems([]);
    setCreatedBill(null);

    if (!patientId.trim()) {

      setError(
        "Please enter a Patient ID."
      );

      return;
    }

    try {

      setLoading(true);

      const response = await api.get(
        "pharmacy/prescriptions/",
        {
          params: {
            patient_id:
              patientId.trim(),
          },
        }
      );

      setPrescriptions(
        response.data
      );

      if (
        response.data.length === 0
      ) {

        setMessage(
          "No prescriptions found for this patient."
        );

      }

    } catch (error) {

      console.error(
        "Error searching prescriptions:",
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


  // ===============================
  // SELECT PRESCRIPTION
  // ===============================

  const handleSelectPrescription =
    (prescription) => {

      const alreadySelected =
        selectedItems.some(
          (item) =>
            item.prescription ===
            prescription.id
        );

      if (alreadySelected) {

        setMessage(
          "This medicine is already added."
        );

        return;
      }

      setSelectedItems(
        (prev) => [
          ...prev,
          {
            prescription:
              prescription.id,

            medicine_name:
              prescription.medicine_name,

            quantity: 1,
          },
        ]
      );
    };


  // ===============================
  // CHANGE QUANTITY
  // ===============================

  const handleQuantityChange =
    (prescriptionId, value) => {

      if (
        value === "" ||
        Number(value) < 1
      ) {

        value = 1;

      }

      setSelectedItems(
        (prev) =>
          prev.map(
            (item) =>
              item.prescription ===
              prescriptionId
                ? {
                    ...item,
                    quantity:
                      Number(value),
                  }
                : item
          )
      );
    };


  // ===============================
  // REMOVE MEDICINE
  // ===============================

  const handleRemove =
    (prescriptionId) => {

      setSelectedItems(
        (prev) =>
          prev.filter(
            (item) =>
              item.prescription !==
              prescriptionId
          )
      );
    };


  // ===============================
  // CREATE PHARMACY BILL
  // ===============================

  const handleCreateBill = async () => {

    setError("");
    setMessage("");

    if (
      selectedItems.length === 0
    ) {

      setError(
        "Please add at least one medicine."
      );

      return;
    }


    try {

      setLoading(true);

      const billData = {

        patient:
          Number(patientId),

        items:
          selectedItems.map(
            (item) => ({
              prescription:
                item.prescription,

              quantity:
                Number(item.quantity),
            })
          ),

      };


      const response = await api.post(
        "pharmacy/bills/",
        billData
      );


      console.log(
        "Created Bill:",
        response.data
      );


      setCreatedBill(
        response.data
      );


      setMessage(
        "Pharmacy bill created successfully."
      );


      setSelectedItems([]);


    } catch (error) {

      console.error(
        "Error creating bill:",
        error
      );


      setError(
        error.response?.data?.detail ||
        "Failed to create pharmacy bill."
      );


    } finally {

      setLoading(false);

    }
  };

  // ===============================
    // PAY PHARMACY BILL
    // ===============================

    const handlePayBill = async () => {

    setError("");
    setMessage("");

    if (!createdBill) {

        return;

    }

    try {

        setLoading(true);

        const response = await api.post(
        `pharmacy/bills/${createdBill.id}/pay/`
        );

        console.log(
        "Payment Response:",
        response.data
        );

        setCreatedBill(
        response.data.bill
        );

        setMessage(
        response.data.message ||
        "Payment successful. Medicines dispensed."
        );

    } catch (error) {

        console.error(
        "Error processing payment:",
        error
        );

        setError(
        error.response?.data?.detail ||
        "Failed to process payment."
        );

    } finally {

        setLoading(false);

    }

    };


  return (

    <div>

      <h2 className="mb-4">
        Pharmacy Bills
      </h2>


      {/* ===============================
          PATIENT SEARCH
      =============================== */}

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <div className="row g-3">


            <div className="col-md-6">

              <label className="form-label">
                Patient ID
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Enter Patient ID"
                value={patientId}
                onChange={(e) =>
                  setPatientId(
                    e.target.value
                  )
                }
              />

            </div>


            <div className="col-md-6 d-flex align-items-end">

              <button
                className="btn text-white"
                style={{
                  backgroundColor:
                    "#1976A3",
                }}
                onClick={handleSearch}
                disabled={loading}
              >

                Search Prescriptions

              </button>

            </div>


          </div>

        </div>

      </div>


      {/* ===============================
          ERROR
      =============================== */}

      {error && (

        <div className="alert alert-danger">

          {error}

        </div>

      )}


      {/* ===============================
          MESSAGE
      =============================== */}

      {message && (

        <div className="alert alert-info">

          {message}

        </div>

      )}


      {/* ===============================
          CREATED BILL
      =============================== */}

      {createdBill && (

        <div className="card shadow-sm mb-4">

          <div className="card-header">

            <strong>
              Pharmacy Bill Created
            </strong>

          </div>


          <div className="card-body">

            <div className="row">


              <div className="col-md-6 mb-3">

                <strong>
                  Bill Number:
                </strong>

                <p>
                  {createdBill.bill_number || "-"}
                </p>

              </div>


              <div className="col-md-6 mb-3">

                <strong>
                  Patient:
                </strong>

                <p>
                  {createdBill.patient_name ||
                    `Patient ID: ${patientId}`}
                </p>

              </div>


              <div className="col-md-4 mb-3">

                <strong>
                  Subtotal:
                </strong>

                <p>
                  ₹ {createdBill.subtotal}
                </p>

              </div>


              <div className="col-md-4 mb-3">

                <strong>
                  GST:
                </strong>

                <p>
                  ₹ {createdBill.gst_amount}
                </p>

              </div>


              <div className="col-md-4 mb-3">

                <strong>
                  Total Amount:
                </strong>

                <p className="fw-bold fs-5">

                  ₹ {createdBill.total_amount}

                </p>

              </div>


              <div className="col-md-6 mb-3">

                <strong>
                    Payment Status:
                </strong>

                <p
                    className={
                    createdBill.payment_status === "PAID"
                        ? "text-success fw-bold"
                        : "text-warning fw-bold"
                    }
                >
                    {createdBill.payment_status}
                </p>

                </div>

                {createdBill.payment_status === "PENDING" && (

                    <div className="col-12">

                        <button
                        className="btn text-white"
                        style={{
                            backgroundColor: "#1976A3",
                        }}
                        onClick={handlePayBill}
                        disabled={loading}
                        >

                        Pay Now

                        </button>

                    </div>

                    )}


            </div>


            {/* ===============================
                BILL ITEMS
            =============================== */}

            {createdBill.items &&
              createdBill.items.length > 0 && (

                <div className="mt-3">

                  <h5>
                    Bill Medicines
                  </h5>


                  <div className="table-responsive">

                    <table className="table table-bordered">

                      <thead className="table-light">

                        <tr>

                          <th>
                            Medicine
                          </th>

                          <th>
                            Quantity
                          </th>

                          <th>
                            Price
                          </th>

                          <th>
                            Total
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {createdBill.items.map(
                          (item, index) => (

                            <tr key={index}>

                              <td>
                                {item.medicine_name ||
                                  item.medicine ||
                                  "-"}
                              </td>


                              <td>
                                {item.quantity}
                              </td>


                              <td>

                                ₹ {
                                  item.unit_price ||
                                  item.price ||
                                  "-"
                                }

                              </td>


                              <td>

                                ₹ {
                                  item.total ||
                                  item.total_price ||
                                  "-"
                                }

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

              )}

          </div>

        </div>

      )}


      {/* ===============================
          LOADING
      =============================== */}

      {loading && (

        <div className="text-center mb-3">

          <div
            className="spinner-border"
            role="status"
          />

        </div>

      )}


      {/* ===============================
          PRESCRIPTIONS
      =============================== */}

      {!loading &&
        prescriptions.length > 0 && (

          <div className="card shadow-sm mb-4">

            <div className="card-header">

              <strong>
                Available Prescriptions
              </strong>

            </div>


            <div className="card-body p-0">

              <div className="table-responsive">

                <table className="table table-bordered mb-0">

                  <thead className="table-light">

                    <tr>

                      <th>
                        Prescription ID
                      </th>

                      <th>
                        Medicine
                      </th>

                      <th>
                        Dosage
                      </th>

                      <th>
                        Frequency
                      </th>

                      <th>
                        Duration
                      </th>

                      <th>
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {prescriptions.map(
                      (prescription) => (

                        <tr
                          key={
                            prescription.id
                          }
                        >

                          <td>
                            {prescription.id}
                          </td>


                          <td>
                            {
                              prescription.medicine_name
                            }
                          </td>


                          <td>
                            {
                              prescription.dosage
                            }
                          </td>


                          <td>
                            {
                              prescription.frequency
                            }
                          </td>


                          <td>
                            {
                              prescription.duration
                            }
                          </td>


                          <td>

                            <button
                              className="btn btn-sm text-white"
                              style={{
                                backgroundColor:
                                  "#1976A3",
                              }}
                              onClick={() =>
                                handleSelectPrescription(
                                  prescription
                                )
                              }
                            >

                              Add

                            </button>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        )}


      {/* ===============================
          SELECTED MEDICINES
      =============================== */}

      {selectedItems.length > 0 && (

        <div className="card shadow-sm">


          <div className="card-header">

            <strong>
              Selected Medicines
            </strong>

          </div>


          <div className="card-body p-0">

            <div className="table-responsive">

              <table className="table table-bordered mb-0">

                <thead className="table-light">

                  <tr>

                    <th>
                      Medicine
                    </th>

                    <th>
                      Quantity
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {selectedItems.map(
                    (item) => (

                      <tr
                        key={
                          item.prescription
                        }
                      >

                        <td>

                          {
                            item.medicine_name
                          }

                        </td>


                        <td>

                          <input
                            type="number"
                            min="1"
                            className="form-control"
                            value={
                              item.quantity
                            }
                            onChange={(e) =>
                              handleQuantityChange(
                                item.prescription,
                                e.target.value
                              )
                            }
                          />

                        </td>


                        <td>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              handleRemove(
                                item.prescription
                              )
                            }
                          >

                            Remove

                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>


          {/* ===============================
              CREATE PHARMACY BILL BUTTON
          =============================== */}

          <div className="p-3 text-end">

            <button
              className="btn text-white"
              style={{
                backgroundColor:
                  "#1976A3",
              }}
              onClick={
                handleCreateBill
              }
              disabled={loading}
            >

              Create Pharmacy Bill

            </button>

          </div>


        </div>

      )}


    </div>

  );
}

export default PharmacyBills;