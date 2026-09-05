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


  // ==========================================
  // SEARCH PRESCRIPTIONS
  // ==========================================

  const handleSearch = async () => {

    setError("");
    setMessage("");
    setPrescriptions([]);
    setSelectedItems([]);
    setCreatedBill(null);

    const enteredPatientId =
      patientId.trim();

    // Patient ID is a STRING
    // Example: PAT0001, PAT0002

    if (!enteredPatientId) {

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
              enteredPatientId,
          },
        }
      );

      console.log(
        "Prescription response:",
        response.data
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

      console.error(
        "Backend response:",
        error.response?.data
      );

      setError(
        error.response?.data?.detail ||
        "Failed to search prescriptions."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // SELECT PRESCRIPTION
  // ==========================================

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

      setMessage("");

      setSelectedItems(
        (prev) => [
          ...prev,

          {
            prescription:
              prescription.id,

            medicine_name:
              prescription.medicine_name,

            quantity:
              prescription.quantity,
          },
        ]
      );

    };


  // ==========================================
  // REMOVE MEDICINE
  // ==========================================

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


  // ==========================================
  // CREATE PHARMACY BILL
  // ==========================================

  const handleCreateBill = async () => {

    setError("");
    setMessage("");

    const enteredPatientId =
      patientId.trim();


    // ======================================
    // CHECK PATIENT ID
    // ======================================

    if (!enteredPatientId) {

      setError(
        "Patient ID is required."
      );

      return;
    }


    // ======================================
    // CHECK SELECTED MEDICINES
    // ======================================

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


      // ======================================
      // PATIENT ID IS A STRING
      // ======================================

      const billData = {

        patient:
          enteredPatientId,

        items:
          selectedItems.map(
            (item) => ({

              prescription:
                item.prescription,

            })
          ),

      };


      console.log(
        "Bill data being sent:",
        billData
      );


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


      // Clear selected medicines

      setSelectedItems([]);


    } catch (error) {

      console.error(
        "Error creating pharmacy bill:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );


      if (
        error.response?.data
      ) {

        const backendError =
          error.response.data;


        if (
          typeof backendError ===
          "object"
        ) {

          if (
            backendError.patient
          ) {

            setError(
              Array.isArray(
                backendError.patient
              )
                ? backendError.patient.join(
                    " "
                  )
                : backendError.patient
            );

          } else if (
            backendError.detail
          ) {

            setError(
              backendError.detail
            );

          } else {

            setError(
              "Failed to create pharmacy bill."
            );

          }

        } else {

          setError(
            "Failed to create pharmacy bill."
          );

        }

      } else {

        setError(
          "Failed to create pharmacy bill."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // PAY PHARMACY BILL
  // ==========================================

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

      console.error(
        "Backend response:",
        error.response?.data
      );


      setError(
        error.response?.data?.detail ||
        "Failed to process payment."
      );


    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // PRINT PHARMACY BILL
  // ==========================================

  const handlePrintBill = () => {

    window.print();

  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (dateValue) => {

    if (!dateValue) {
      return "-";
    }

    const date =
      new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

  };


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div>


      {/* ======================================
          PRINT CSS
      ====================================== */}

      <style>
        {`
          @media print {

            body * {
              visibility: hidden;
            }

            .print-bill,
            .print-bill * {
              visibility: visible;
            }

            .print-bill {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
              margin: 0;
              box-shadow: none !important;
              border: none !important;
            }

            .no-print {
              display: none !important;
            }

            .print-bill table {
              width: 100%;
              border-collapse: collapse;
            }

            .print-bill th,
            .print-bill td {
              border: 1px solid #000 !important;
              padding: 8px;
            }

            .print-bill-header {
              text-align: center;
              margin-bottom: 20px;
            }

            .print-bill-header h2 {
              margin-bottom: 5px;
            }

            .print-total {
              font-size: 18px;
              font-weight: bold;
            }

            @page {
              size: A4;
              margin: 15mm;
            }

          }
        `}
      </style>


      {/* ======================================
          PAGE TITLE
      ====================================== */}

      <div className="no-print">

        <h2 className="mb-4">

          Pharmacy Bills

        </h2>

      </div>


      {/* ======================================
          PATIENT SEARCH
      ====================================== */}

      <div className="card shadow-sm mb-4 no-print">

        <div className="card-body">

          <div className="row g-3">


            {/* PATIENT ID */}

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


            {/* SEARCH BUTTON */}

            <div className="col-md-6 d-flex align-items-end">

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
                disabled={loading}
              >

                Search Prescriptions

              </button>

            </div>


          </div>

        </div>

      </div>


      {/* ======================================
          ERROR MESSAGE
      ====================================== */}

      {error && (

        <div className="alert alert-danger no-print">

          {error}

        </div>

      )}


      {/* ======================================
          SUCCESS / INFORMATION MESSAGE
      ====================================== */}

      {message && (

        <div className="alert alert-info no-print">

          {message}

        </div>

      )}


      {/* ======================================
          CREATED BILL
      ====================================== */}

      {createdBill && (

        <div
          className="card shadow-sm mb-4 print-bill"
        >


          {/* =================================
              PRINT BILL HEADER
          ================================= */}

          <div className="print-bill-header">

            <h2>

              PHARMACY BILL

            </h2>

            <p className="mb-0">

              Pharmacy Department

            </p>

            <hr />

          </div>


          <div className="card-body">


            {/* =================================
                BILL INFORMATION
            ================================= */}

            <div className="row mb-3">


              {/* BILL NUMBER */}

              <div className="col-md-6 mb-2">

                <strong>

                  Bill Number:

                </strong>

                <div>

                  {createdBill.bill_number ||
                    "-"}

                </div>

              </div>


              {/* BILL DATE */}

              <div className="col-md-6 mb-2">

                <strong>

                  Bill Date:

                </strong>

                <div>

                  {formatDate(
                    createdBill.issue_date ||
                    createdBill.created_at
                  )}

                </div>

              </div>


              {/* PATIENT ID */}

              <div className="col-md-6 mb-2">

                <strong>

                  Patient ID:

                </strong>

                <div>

                  {createdBill.patient_id ||
                    patientId ||
                    "-"}

                </div>

              </div>


              {/* PATIENT NAME */}

              <div className="col-md-6 mb-2">

                <strong>

                  Patient:

                </strong>

                <div>

                  {createdBill.patient_name ||
                    `Patient ID: ${patientId}`}

                </div>

              </div>


            </div>


            {/* =================================
                BILL ITEMS
            ================================= */}

            {createdBill.items &&
              createdBill.items.length > 0 && (

                <div className="mt-3">

                  <h5 className="mb-3">

                    Bill Medicines

                  </h5>


                  <div className="table-responsive">

                    <table className="table table-bordered">

                      <thead>

                        <tr>

                          <th>

                            S.No

                          </th>

                          <th>

                            Medicine

                          </th>

                          <th>

                            Quantity

                          </th>

                          <th>

                            Unit Price

                          </th>

                          <th>

                            Total

                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {createdBill.items.map(
                          (item, index) => (

                            <tr
                              key={index}
                            >

                              <td>

                                {index + 1}

                              </td>


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
                                  "0.00"
                                }

                              </td>


                              <td>

                                ₹ {
                                  item.total_price ||
                                  item.total ||
                                  "0.00"
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


            {/* =================================
                BILL SUMMARY
            ================================= */}

            <div className="row justify-content-end mt-4">

              <div className="col-md-5">


                <div className="d-flex justify-content-between mb-2">

                  <strong>

                    Subtotal:

                  </strong>

                  <span>

                    ₹ {createdBill.subtotal}

                  </span>

                </div>


                <div className="d-flex justify-content-between mb-2">

                  <strong>

                    GST (5%):

                  </strong>

                  <span>

                    ₹ {createdBill.gst_amount}

                  </span>

                </div>


                <hr />


                <div className="d-flex justify-content-between print-total">

                  <strong>

                    Total Amount:

                  </strong>

                  <span>

                    ₹ {createdBill.total_amount}

                  </span>

                </div>


              </div>

            </div>


            {/* =================================
                PAYMENT STATUS
            ================================= */}

            <div className="mt-4">

              <strong>

                Payment Status:

              </strong>


              <span
                className={
                  createdBill.payment_status ===
                  "PAID"
                    ? "text-success fw-bold ms-2"
                    : "text-warning fw-bold ms-2"
                }
              >

                {createdBill.payment_status}

              </span>

            </div>


            {/* =================================
                PRINT FOOTER
            ================================= */}

            <div className="text-center mt-5">

              <hr />

              <p className="mb-1">

                Thank you 

              </p>

              <p className="mb-0">

                Please keep this bill for your records.

              </p>

            </div>


            {/* =================================
                ACTION BUTTONS
            ================================= */}

            <div className="mt-4 no-print">


              {/* PAY BUTTON */}

              {createdBill.payment_status ===
                "PENDING" && (

                <button
                  type="button"
                  className="btn text-white me-2"
                  style={{
                    backgroundColor:
                      "#1976A3",
                  }}
                  onClick={
                    handlePayBill
                  }
                  disabled={loading}
                >

                  {loading
                    ? "Processing..."
                    : "Pay Now"}

                </button>

              )}


              {/* PRINT BUTTON */}

              <button
                type="button"
                className="btn btn-success"
                onClick={
                  handlePrintBill
                }
              >

                🖨 Print Bill

              </button>


            </div>


          </div>

        </div>

      )}


      {/* ======================================
          LOADING
      ====================================== */}

      {loading && (

        <div className="text-center mb-3 no-print">

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


      {/* ======================================
          AVAILABLE PRESCRIPTIONS
      ====================================== */}

      {!loading &&
        prescriptions.length > 0 && (

          <div className="card shadow-sm mb-4 no-print">

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

                        Quantity

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


                          {/* PRESCRIPTION ID */}

                          <td>

                            {prescription.id}

                          </td>


                          {/* MEDICINE */}

                          <td>

                            {
                              prescription.medicine_name
                            }

                          </td>


                          {/* DOSAGE */}

                          <td>

                            {
                              prescription.dosage ||
                              prescription.medicine_dosage_form ||
                              "-"
                            }

                          </td>


                          {/* FREQUENCY */}

                          <td>

                            {
                              prescription.frequency
                            }

                          </td>


                          {/* DURATION */}

                          <td>

                            {
                              prescription.duration
                            }{" "}

                            {
                              prescription.duration_unit ||
                              ""
                            }

                          </td>


                          {/* QUANTITY */}

                          <td>

                            {
                              prescription.quantity ??
                              "-"
                            }

                          </td>


                          {/* ACTION */}

                          <td>

                            <button
                              type="button"
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


      {/* ======================================
          SELECTED MEDICINES
      ====================================== */}

      {selectedItems.length > 0 && (

        <div className="card shadow-sm no-print">

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

                        {/* MEDICINE */}

                        <td>

                          {
                            item.medicine_name
                          }

                        </td>


                        {/* QUANTITY */}

                        <td>

                          {item.quantity}

                        </td>


                        {/* REMOVE */}

                        <td>

                          <button
                            type="button"
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


          {/* CREATE BILL */}

          <div className="p-3 text-end">

            <button
              type="button"
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

              {loading
                ? "Creating..."
                : "Create Pharmacy Bill"}

            </button>

          </div>

        </div>

      )}

    </div>

  );

}

export default PharmacyBills;