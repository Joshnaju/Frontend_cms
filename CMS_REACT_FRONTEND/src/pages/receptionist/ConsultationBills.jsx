import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";

function ConsultationBills() {
  const location = useLocation();
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  const [searchType, setSearchType] = useState("patient_id");
  const [searchValue, setSearchValue] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // HELPERS
  // =====================================================

  const formatTime = (time) => {
    if (!time) return "-";
    return time.slice(0, 5);
  };

  const formatAppointmentType = (type) => {
    if (type === "WALK_IN") return "Walk-in";
    if (type === "PRIOR_BOOKING") return "Prior Booking";
    return type || "-";
  };

  const formatBillDate = (dateTime) => {
    if (!dateTime) return "-";

    return new Date(dateTime).toLocaleDateString("en-GB");
  };

  const getBillId = (bill) => {
    return (
      bill.bill_display_id ||
      `CB${String(bill.id).padStart(4, "0")}`
    );
  };

  const getAppointmentId = (bill) => {
    return (
      bill.appointment_display_id ||
      (bill.appointment
        ? `APT${String(bill.appointment).padStart(4, "0")}`
        : "-")
    );
  };

  // =====================================================
  // LOAD BILLS
  // =====================================================

  const fetchBills = async (params = {}) => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get(
        "receptionist/consultation-bills/",
        {
          params,
        }
      );

      setBills(response.data);

      if (response.data.length === 0) {
        setMessage("No consultation bills found.");
      }
    } catch (error) {
      console.error("Error fetching consultation bills:", error);

      setBills([]);
      setMessage("Unable to load consultation bills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // =====================================================
  // SIDEBAR RESET
  // =====================================================

  useEffect(() => {
    if (location.state?.resetSection) {
      setSelectedBill(null);

      setSearchType("patient_id");
      setSearchValue("");

      setMessage("");

      fetchBills();
    }
  }, [location.state?.resetKey]);

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = async () => {
    const value = searchValue.trim();

    if (!value) {
      setMessage("Please enter a search value.");
      return;
    }

    await fetchBills({
      [searchType]: value,
    });
  };

  const handleClearSearch = async () => {
    setSearchValue("");
    setMessage("");
    setSelectedBill(null);

    await fetchBills();
  };

  // =====================================================
  // VIEW BILL
  // =====================================================

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setMessage("");
  };

  // =====================================================
  // PRINT BILL
  // =====================================================

  const handlePrintBill = (bill) => {
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      setMessage(
        "Unable to open print window. Please allow pop-ups and try again."
      );
      return;
    }

    const billId = getBillId(bill);
    const appointmentId = getAppointmentId(bill);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${billId} - Consultation Bill</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              font-family: Arial, Helvetica, sans-serif;
              margin: 0;
              padding: 30px;
              color: #000;
              background: #fff;
            }

            .bill-container {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #bbb;
              padding: 30px;
            }

            .hospital-header {
              text-align: center;
              margin-bottom: 20px;
            }

            .hospital-header h1 {
              margin: 0 0 8px;
              font-size: 26px;
            }

            .hospital-header p {
              margin: 3px 0;
              font-size: 14px;
            }

            .bill-title {
              text-align: center;
              font-size: 22px;
              font-weight: bold;
              margin: 25px 0;
              text-transform: uppercase;
            }

            .section-title {
              font-size: 17px;
              font-weight: bold;
              margin-top: 22px;
              margin-bottom: 10px;
              border-bottom: 1px solid #999;
              padding-bottom: 6px;
            }

            .details-table {
              width: 100%;
              border-collapse: collapse;
            }

            .details-table td {
              padding: 8px 5px;
              vertical-align: top;
            }

            .details-table td:first-child {
              width: 40%;
              font-weight: bold;
            }

            .fee-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }

            .fee-table th,
            .fee-table td {
              border: 1px solid #999;
              padding: 10px;
              text-align: left;
            }

            .fee-table th:last-child,
            .fee-table td:last-child {
              text-align: right;
            }

            .total-row {
              font-weight: bold;
              font-size: 16px;
            }

            .footer {
              margin-top: 35px;
              text-align: center;
              font-size: 13px;
            }

            @media print {
              body {
                padding: 0;
              }

              .bill-container {
                border: none;
                max-width: 100%;
              }
            }
          </style>
        </head>

        <body>
          <div class="bill-container">

            <div class="hospital-header">
              <h1>Multi-Speciality Medical Centre</h1>
              <p>Medical Centre Management System</p>
              <p>Consultation Services</p>
            </div>

            <div class="bill-title">
              Consultation Bill
            </div>

            <div class="section-title">
              Bill Details
            </div>

            <table class="details-table">
              <tr>
                <td>Bill ID</td>
                <td>${billId}</td>
              </tr>

              <tr>
                <td>Bill Date</td>
                <td>${formatBillDate(bill.created_at)}</td>
              </tr>

              <tr>
                <td>Payment Status</td>
                <td>${bill.payment_status || "PAID"}</td>
              </tr>
            </table>

            <div class="section-title">
              Patient Details
            </div>

            <table class="details-table">
              <tr>
                <td>Patient ID</td>
                <td>${bill.patient_id || "-"}</td>
              </tr>

              <tr>
                <td>Patient Name</td>
                <td>${bill.patient_name || "-"}</td>
              </tr>
            </table>

            <div class="section-title">
              Doctor Details
            </div>

            <table class="details-table">
              <tr>
                <td>Doctor</td>
                <td>${bill.doctor_name || "-"}</td>
              </tr>

              <tr>
                <td>Department</td>
                <td>${bill.department_name || "-"}</td>
              </tr>
            </table>

            <div class="section-title">
              Appointment Details
            </div>

            <table class="details-table">
              <tr>
                <td>Appointment ID</td>
                <td>${appointmentId}</td>
              </tr>

              <tr>
                <td>Appointment Type</td>
                <td>${formatAppointmentType(
                  bill.appointment_type
                )}</td>
              </tr>

              <tr>
                <td>Appointment Date</td>
                <td>${bill.appointment_date || "-"}</td>
              </tr>

              <tr>
                <td>Appointment Time</td>
                <td>${formatTime(bill.appointment_time)}</td>
              </tr>

              <tr>
                <td>Token Number</td>
                <td>${bill.token_number ?? "-"}</td>
              </tr>
            </table>

            <div class="section-title">
              Payment Details
            </div>

            <table class="fee-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Registration Fee</td>
                  <td>₹${bill.registration_fee}</td>
                </tr>

                <tr>
                  <td>Consultation Fee</td>
                  <td>₹${bill.consultation_fee}</td>
                </tr>

                <tr class="total-row">
                  <td>Total Amount</td>
                  <td>₹${bill.total_amount}</td>
                </tr>
              </tbody>
            </table>

            <div class="footer">
              <p>Thank you.</p>
              <p>This is a computer-generated consultation bill.</p>
            </div>

          </div>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  // =====================================================
  // BILL DETAILS PAGE
  // =====================================================

  if (selectedBill) {
    return (
      <div>
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={() => setSelectedBill(null)}
        >
          ← Back
        </button>

        <div
          className="card shadow-sm mx-auto"
          style={{ maxWidth: "850px" }}
        >
          <div className="card-body p-3 p-md-4">

            <div className="text-center mb-4">
              <h3 className="mb-1">
                Multi-Speciality Medical Centre
              </h3>

              <div className="text-muted">
                
              </div>

              <h4 className="mt-4 mb-0">
                Consultation Bill
              </h4>
            </div>

            <BillSection title="Bill Details">
              <DetailRow
                label="Bill ID"
                value={getBillId(selectedBill)}
              />

              <DetailRow
                label="Bill Date"
                value={formatBillDate(selectedBill.created_at)}
              />

              <DetailRow
                label="Payment Status"
                value={selectedBill.payment_status || "PAID"}
              />
            </BillSection>

            <BillSection title="Patient Details">
              <DetailRow
                label="Patient ID"
                value={selectedBill.patient_id}
              />

              <DetailRow
                label="Patient Name"
                value={selectedBill.patient_name}
              />
            </BillSection>

            <BillSection title="Doctor Details">
              <DetailRow
                label="Doctor"
                value={selectedBill.doctor_name}
              />

              <DetailRow
                label="Department"
                value={selectedBill.department_name}
              />
            </BillSection>

            <BillSection title="Appointment Details">
              <DetailRow
                label="Appointment ID"
                value={getAppointmentId(selectedBill)}
              />

              <DetailRow
                label="Appointment Type"
                value={formatAppointmentType(
                  selectedBill.appointment_type
                )}
              />

              <DetailRow
                label="Appointment Date"
                value={selectedBill.appointment_date}
              />

              <DetailRow
                label="Appointment Time"
                value={formatTime(
                  selectedBill.appointment_time
                )}
              />

              <DetailRow
                label="Token Number"
                value={selectedBill.token_number}
              />
            </BillSection>

            <div className="mt-4">
              <h5 className="border-bottom pb-2">
                Payment Details
              </h5>

              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Registration Fee</td>

                      <td className="text-end">
                        ₹{selectedBill.registration_fee}
                      </td>
                    </tr>

                    <tr>
                      <td>Consultation Fee</td>

                      <td className="text-end">
                        ₹{selectedBill.consultation_fee}
                      </td>
                    </tr>

                    <tr className="fw-bold">
                      <td>Total Amount</td>

                      <td className="text-end">
                        ₹{selectedBill.total_amount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="d-grid d-sm-flex justify-content-sm-end mt-4">
              <button
                type="button"
                className="btn text-white px-4"
                style={{
                  backgroundColor: "#1976A3",
                }}
                onClick={() => handlePrintBill(selectedBill)}
              >
                Print Bill
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN VIEW
  // =====================================================

  return (
    <div>
      <h2 className="mb-4">
        Consultation Bills
      </h2>

      <div className="card shadow-sm">
        <div className="card-body">

          <h5 className="mb-3">
            View / Print Consultation Bills
          </h5>

          {/* SEARCH */}

          <div className="row g-2 align-items-end">

            <div className="col-12 col-md-3">
              <label className="form-label">
                Search By
              </label>

              <select
                className="form-select"
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value);
                  setSearchValue("");
                  setMessage("");
                }}
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

                <option value="date">
                  Bill Date
                </option>

                <option value="bill_id">
                  Bill ID
                </option>

                <option value="appointment_id">
                  Appointment ID
                </option>
              </select>
            </div>

            <div className="col-12 col-md-5">
              <label className="form-label">
                Search Value
              </label>

              {searchType === "date" ? (
                <input
                  type="date"
                  className="form-control"
                  value={searchValue}
                  onChange={(e) =>
                    setSearchValue(e.target.value)
                  }
                />
              ) : (
                <input
                  type="text"
                  className="form-control"
                  value={searchValue}
                  placeholder={
                    searchType === "patient_id"
                      ? "Example: PAT0001"
                      : searchType === "patient_name"
                      ? "Enter patient name"
                      : searchType === "doctor_name"
                      ? "Enter doctor name"
                      : searchType === "bill_id"
                      ? "Example: CB0001"
                      : "Example: APT0001"
                  }
                  onChange={(e) =>
                    setSearchValue(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              )}
            </div>

            <div className="col-12 col-md-4">
              <div className="d-grid d-sm-flex gap-2">

                <button
                  type="button"
                  className="btn text-white flex-fill"
                  style={{
                    backgroundColor: "#1976A3",
                  }}
                  onClick={handleSearch}
                >
                  Search
                </button>

                <button
                  type="button"
                  className="btn btn-secondary flex-fill"
                  onClick={handleClearSearch}
                >
                  Clear
                </button>

              </div>
            </div>

          </div>

          {message && (
            <div className="alert alert-info mt-3 mb-0">
              {message}
            </div>
          )}

        </div>
      </div>

      {/* BILL TABLE */}

      <div className="card shadow-sm mt-4">
        <div className="card-body p-0 p-sm-3">

          {loading ? (
            <div className="text-center py-4">
              Loading consultation bills...
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle mb-0">

                <thead>
                  <tr>
                    <th className="text-nowrap">
                      Bill ID
                    </th>

                    <th className="text-nowrap">
                      Appointment ID
                    </th>

                    <th className="text-nowrap">
                      Patient ID
                    </th>

                    <th>Patient</th>

                    <th>Doctor</th>

                    <th>Department</th>

                    <th className="text-nowrap">
                      Appointment Date
                    </th>

                    <th className="text-nowrap">
                      Time
                    </th>

                    <th className="text-nowrap">
                      Total
                    </th>

                    <th className="text-nowrap">
                      Payment
                    </th>

                    <th className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bills.length > 0 ? (
                    bills.map((bill) => (
                      <tr key={bill.id}>

                        <td className="text-nowrap">
                          {getBillId(bill)}
                        </td>

                        <td className="text-nowrap">
                          {getAppointmentId(bill)}
                        </td>

                        <td className="text-nowrap">
                          {bill.patient_id || "-"}
                        </td>

                        <td>
                          {bill.patient_name || "-"}
                        </td>

                        <td>
                          {bill.doctor_name || "-"}
                        </td>

                        <td>
                          {bill.department_name || "-"}
                        </td>

                        <td className="text-nowrap">
                          {bill.appointment_date || "-"}
                        </td>

                        <td className="text-nowrap">
                          {formatTime(
                            bill.appointment_time
                          )}
                        </td>

                        <td className="text-nowrap">
                          ₹{bill.total_amount}
                        </td>

                        <td>
                          <span className="badge bg-success">
                            {bill.payment_status || "PAID"}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex flex-column flex-xl-row gap-2 justify-content-center">

                            <button
                              type="button"
                              className="btn btn-sm text-white text-nowrap"
                              style={{
                                backgroundColor: "#1976A3",
                              }}
                              onClick={() =>
                                handleViewBill(bill)
                              }
                            >
                              View
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-secondary text-nowrap"
                              onClick={() =>
                                handlePrintBill(bill)
                              }
                            >
                              Print
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="11"
                        className="text-center py-4"
                      >
                        No consultation bills found.
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

// =========================================================
// BILL SECTION
// =========================================================

function BillSection({ title, children }) {
  return (
    <div className="mt-4">
      <h5 className="border-bottom pb-2">
        {title}
      </h5>

      {children}
    </div>
  );
}

// =========================================================
// DETAIL ROW
// =========================================================

function DetailRow({ label, value }) {
  return (
    <div className="row py-2 border-bottom">
      <div className="col-12 col-sm-5 fw-bold mb-1 mb-sm-0">
        {label}
      </div>

      <div className="col-12 col-sm-7">
        {value ?? "-"}
      </div>
    </div>
  );
}

export default ConsultationBills;
