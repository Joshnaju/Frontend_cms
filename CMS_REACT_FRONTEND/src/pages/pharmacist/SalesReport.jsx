import { useState } from "react";
import api from "../../services/api";

function SalesReport() {
    const [period, setPeriod] = useState("daily");

    const [selectedDate, setSelectedDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Generate sales report
    const handleGenerateReport = async () => {
        setLoading(true);
        setError("");
        setMessage("");
        setReport(null);

        try {
            let params = {};

            // Specific date
            if (period === "date") {
                if (!selectedDate) {
                    setError("Please select a date.");
                    setLoading(false);
                    return;
                }

                params = {
                    date: selectedDate,
                };
            }

            // Custom date range
            else if (period === "custom") {
                if (!startDate || !endDate) {
                    setError("Please select both start date and end date.");
                    setLoading(false);
                    return;
                }

                if (startDate > endDate) {
                    setError("Start date cannot be after end date.");
                    setLoading(false);
                    return;
                }

                params = {
                    start_date: startDate,
                    end_date: endDate,
                };
            }

            // Daily / Weekly / Monthly
            else {
                params = {
                    period: period,
                };
            }

            const response = await api.get(
                "pharmacy/reports/sales/",
                {
                    params: params,
                }
            );

            setReport(response.data);

            if (
                response.data.records &&
                response.data.records.length > 0
            ) {
                setMessage("Sales report generated successfully.");
            } else {
                setMessage("No sales records found for the selected period.");
            }

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.detail ||
                "Failed to generate sales report."
            );
        } finally {
            setLoading(false);
        }
    };

    // Print report
    const handlePrint = () => {
        window.print();
    };

    // Format date
    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString();
    };

    // Format date and time
    const formatDateTime = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString();
    };

    // Format currency
    const formatCurrency = (value) => {
        return Number(value || 0).toFixed(2);
    };

    // Report title
    const getReportTitle = () => {
        if (!report) {
            return "Pharmacy Sales Report";
        }

        if (period === "daily") {
            return "Daily Sales Report";
        }

        if (period === "weekly") {
            return "Weekly Sales Report";
        }

        if (period === "monthly") {
            return "Monthly Sales Report";
        }

        if (period === "date") {
            return `Sales Report - ${formatDate(selectedDate)}`;
        }

        if (period === "custom") {
            return `Sales Report - ${formatDate(startDate)} to ${formatDate(endDate)}`;
        }

        return "Pharmacy Sales Report";
    };

    /*
     * Calculate subtotal from all dispensed medicine items.
     *
     * GST is NOT calculated here because GST is already
     * returned by the backend as report.total_gst.
     */
    const calculateSubtotal = () => {
        if (!report || !report.records) {
            return 0;
        }

        return report.records.reduce(
            (total, record) =>
                total + Number(record.total_price || 0),
            0
        );
    };

    return (
        <>
            {/* ============================= */}
            {/* NORMAL SCREEN CONTENT */}
            {/* ============================= */}

            <div className="container-fluid mt-4 sales-report-page">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold">
                            Pharmacy Sales Report
                        </h2>

                        <p className="text-muted mb-0">
                            View medicine sales and payment details.
                        </p>
                    </div>

                    {report && (
                        <button
                            className="btn btn-dark"
                            onClick={handlePrint}
                        >
                            Print Report
                        </button>
                    )}
                </div>

                {/* ============================= */}
                {/* FILTER SECTION */}
                {/* ============================= */}

                <div className="card shadow-sm mb-4">
                    <div className="card-body">

                        <h5 className="fw-bold mb-3">
                            Select Report Period
                        </h5>

                        <div className="row g-3 align-items-end">

                            {/* Period */}
                            <div className="col-md-4">

                                <label className="form-label fw-semibold">
                                    Report Type
                                </label>

                                <select
                                    className="form-select"
                                    value={period}
                                    onChange={(e) => {
                                        setPeriod(e.target.value);
                                        setReport(null);
                                        setError("");
                                        setMessage("");
                                    }}
                                >
                                    <option value="daily">
                                        Daily
                                    </option>

                                    <option value="weekly">
                                        Weekly
                                    </option>

                                    <option value="monthly">
                                        Monthly
                                    </option>

                                    <option value="date">
                                        Specific Date
                                    </option>

                                    <option value="custom">
                                        Custom Date Range
                                    </option>
                                </select>

                            </div>

                            {/* Specific Date */}
                            {period === "date" && (
                                <div className="col-md-4">

                                    <label className="form-label fw-semibold">
                                        Select Date
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        value={selectedDate}
                                        onChange={(e) =>
                                            setSelectedDate(e.target.value)
                                        }
                                    />

                                </div>
                            )}

                            {/* Start Date */}
                            {period === "custom" && (
                                <>
                                    <div className="col-md-3">

                                        <label className="form-label fw-semibold">
                                            Start Date
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control"
                                            value={startDate}
                                            onChange={(e) =>
                                                setStartDate(e.target.value)
                                            }
                                        />

                                    </div>

                                    <div className="col-md-3">

                                        <label className="form-label fw-semibold">
                                            End Date
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control"
                                            value={endDate}
                                            onChange={(e) =>
                                                setEndDate(e.target.value)
                                            }
                                        />

                                    </div>
                                </>
                            )}

                            {/* Generate Button */}
                            <div className="col-md-auto">

                                <button
                                    className="btn btn-primary"
                                    onClick={handleGenerateReport}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Generating..."
                                        : "Generate Report"}
                                </button>

                            </div>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="alert alert-danger mt-3 mb-0">
                                {error}
                            </div>
                        )}

                        {/* Message */}
                        {message && !error && (
                            <div className="alert alert-info mt-3 mb-0">
                                {message}
                            </div>
                        )}

                    </div>
                </div>


                {/* ============================= */}
                {/* REPORT */}
                {/* ============================= */}

                {report && (

                    <div className="card shadow-sm mb-5">

                        <div className="card-body">

                            <div className="text-center mb-4">

                                <h3 className="fw-bold">
                                    {getReportTitle()}
                                </h3>

                                <p className="text-muted mb-0">
                                    Pharmacy Sales Report
                                </p>

                            </div>


                            {/* ============================= */}
                            {/* SUMMARY CARDS */}
                            {/* ============================= */}

                            <div className="row g-3 mb-4">

                                {/* Total Sales */}
                                <div className="col-md-3">

                                    <div className="card border h-100">
                                        <div className="card-body text-center">

                                            <h6 className="text-muted">
                                                Total Sales
                                            </h6>

                                            <h4 className="fw-bold">
                                                ₹{formatCurrency(
                                                    report.total_sales
                                                )}
                                            </h4>

                                        </div>
                                    </div>

                                </div>


                                {/* GST */}
                                <div className="col-md-3">

                                    <div className="card border h-100">
                                        <div className="card-body text-center">

                                            <h6 className="text-muted">
                                                GST Collected
                                            </h6>

                                            <h4 className="fw-bold">
                                                ₹{formatCurrency(
                                                    report.total_gst
                                                )}
                                            </h4>

                                        </div>
                                    </div>

                                </div>


                                {/* Items Sold */}
                                <div className="col-md-3">

                                    <div className="card border h-100">
                                        <div className="card-body text-center">

                                            <h6 className="text-muted">
                                                Items Sold
                                            </h6>

                                            <h4 className="fw-bold">
                                                {report.total_items_sold || 0}
                                            </h4>

                                        </div>
                                    </div>

                                </div>


                                {/* Bills */}
                                <div className="col-md-3">

                                    <div className="card border h-100">
                                        <div className="card-body text-center">

                                            <h6 className="text-muted">
                                                Bills / Sales
                                            </h6>

                                            <h4 className="fw-bold">
                                                {report.total_bills || 0}
                                            </h4>

                                        </div>
                                    </div>

                                </div>

                            </div>


                            {/* ============================= */}
                            {/* SALES TABLE */}
                            {/* ============================= */}

                            <div className="table-responsive">

                                <table className="table table-bordered table-striped align-middle">

                                    <thead className="table-dark">

                                        <tr>

                                            <th>S.No</th>

                                            <th>Bill Number</th>

                                            <th>Patient ID</th>

                                            <th>Patient</th>

                                            <th>Doctor</th>

                                            <th>Prescription Date</th>

                                            <th>Issue Date</th>

                                            <th>Medicine ID</th>

                                            <th>Medicine</th>

                                            <th>Qty</th>

                                            <th>Unit Price</th>

                                            <th>Total Price</th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {report.records &&
                                        report.records.length > 0 ? (

                                            report.records.map(
                                                (record, index) => (

                                                    <tr key={record.dispensing_id || index}>

                                                        {/* S.No */}
                                                        <td>
                                                            {index + 1}
                                                        </td>

                                                        {/* Bill Number */}
                                                        <td>
                                                            {record.bill_number || "-"}
                                                        </td>

                                                        {/* Patient ID */}
                                                        <td>
                                                            {record.patient_id || "-"}
                                                        </td>

                                                        {/* Patient */}
                                                        <td>
                                                            {record.patient || "-"}
                                                        </td>

                                                        {/* Doctor */}
                                                        <td>
                                                            {record.doctor || "-"}
                                                        </td>

                                                        {/* Prescription Date */}
                                                        <td>
                                                            {formatDateTime(
                                                                record.prescription_date
                                                            )}
                                                        </td>

                                                        {/* Issue Date */}
                                                        <td>
                                                            {formatDateTime(
                                                                record.issue_date
                                                            )}
                                                        </td>

                                                        {/* Medicine ID */}
                                                        <td>
                                                            {record.medicine_id || "-"}
                                                        </td>

                                                        {/* Medicine */}
                                                        <td>
                                                            {record.medicine || "-"}
                                                        </td>

                                                        {/* Quantity */}
                                                        <td>
                                                            {record.quantity || 0}
                                                        </td>

                                                        {/* Unit Price */}
                                                        <td>
                                                            ₹
                                                            {formatCurrency(
                                                                record.unit_price
                                                            )}
                                                        </td>

                                                        {/* Total Price */}
                                                        <td>
                                                            ₹
                                                            {formatCurrency(
                                                                record.total_price
                                                            )}
                                                        </td>

                                                    </tr>

                                                )
                                            )

                                        ) : (

                                            <tr>

                                                <td
                                                    colSpan="12"
                                                    className="text-center py-4"
                                                >
                                                    No sales records found.
                                                </td>

                                            </tr>

                                        )}

                                    </tbody>

                                </table>

                            </div>


                            {/* ============================= */}
                            {/* TOTAL SECTION BELOW TABLE */}
                            {/* ============================= */}

                            <div className="row justify-content-end mt-4">

                                <div className="col-md-5">

                                    <div className="border rounded p-3">

                                        {/* Subtotal */}
                                        <div className="d-flex justify-content-between mb-2">

                                            <span className="fw-semibold">
                                                Subtotal
                                            </span>

                                            <span>
                                                ₹
                                                {formatCurrency(
                                                    calculateSubtotal()
                                                )}
                                            </span>

                                        </div>


                                        {/* GST */}
                                        <div className="d-flex justify-content-between mb-2">

                                            <span className="fw-semibold">
                                                GST Taken
                                            </span>

                                            <span>
                                                ₹
                                                {formatCurrency(
                                                    report.total_gst
                                                )}
                                            </span>

                                        </div>


                                        <hr />


                                        {/* Total Sales */}
                                        <div className="d-flex justify-content-between">

                                            <span className="fw-bold fs-5">
                                                Total Sales
                                            </span>

                                            <span className="fw-bold fs-5">
                                                ₹
                                                {formatCurrency(
                                                    report.total_sales
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>


                        </div>

                    </div>

                )}

            </div>


            {/* ================================================= */}
            {/* PRINT ONLY REPORT */}
            {/* ================================================= */}

            {report && (

                <div className="print-sales-report">

                    <div className="print-header">

                        <h1>
                            {getReportTitle()}
                        </h1>

                        <p>
                            Pharmacy Sales Report
                        </p>

                    </div>


                    <table>

                        <thead>

                            <tr>

                                <th>S.No</th>
                                <th>Bill No</th>
                                <th>Patient ID</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Prescription Date</th>
                                <th>Issue Date</th>
                                <th>Medicine ID</th>
                                <th>Medicine</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Total Price</th>

                            </tr>

                        </thead>


                        <tbody>

                            {report.records &&
                                report.records.map(
                                    (record, index) => (

                                        <tr key={record.dispensing_id || index}>

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                {record.bill_number || "-"}
                                            </td>

                                            <td>
                                                {record.patient_id || "-"}
                                            </td>

                                            <td>
                                                {record.patient || "-"}
                                            </td>

                                            <td>
                                                {record.doctor || "-"}
                                            </td>

                                            <td>
                                                {formatDateTime(
                                                    record.prescription_date
                                                )}
                                            </td>

                                            <td>
                                                {formatDateTime(
                                                    record.issue_date
                                                )}
                                            </td>

                                            <td>
                                                {record.medicine_id || "-"}
                                            </td>

                                            <td>
                                                {record.medicine || "-"}
                                            </td>

                                            <td>
                                                {record.quantity || 0}
                                            </td>

                                            <td>
                                                ₹
                                                {formatCurrency(
                                                    record.unit_price
                                                )}
                                            </td>

                                            <td>
                                                ₹
                                                {formatCurrency(
                                                    record.total_price
                                                )}
                                            </td>

                                        </tr>

                                    )
                                )}

                        </tbody>

                    </table>


                    {/* PRINT TOTAL SECTION */}

                    <div className="print-total">

                        <div>
                            <strong>
                                Subtotal:
                            </strong>

                            <span>
                                ₹
                                {formatCurrency(
                                    calculateSubtotal()
                                )}
                            </span>
                        </div>


                        <div>
                            <strong>
                                GST Taken:
                            </strong>

                            <span>
                                ₹
                                {formatCurrency(
                                    report.total_gst
                                )}
                            </span>
                        </div>


                        <div className="grand-total">

                            <strong>
                                Total Sales:
                            </strong>

                            <span>
                                ₹
                                {formatCurrency(
                                    report.total_sales
                                )}
                            </span>

                        </div>

                    </div>


                    <div className="print-footer">
                        Thank you.
                    </div>

                </div>

            )}


            {/* ================================================= */}
            {/* PRINT CSS */}
            {/* ================================================= */}

            <style>
                {`
                    .print-sales-report {
                        display: none;
                    }

                    @media print {

                        @page {
                            size: A4 landscape;
                            margin: 10mm;
                        }

                        body * {
                            visibility: hidden;
                        }

                        .print-sales-report,
                        .print-sales-report * {
                            visibility: visible;
                        }

                        .print-sales-report {
                            display: block;
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            font-family: Arial, sans-serif;
                        }

                        .sales-report-page {
                            display: none !important;
                        }

                        .print-header {
                            text-align: center;
                            margin-bottom: 20px;
                        }

                        .print-header h1 {
                            font-size: 22px;
                            margin-bottom: 5px;
                        }

                        .print-header p {
                            font-size: 14px;
                            margin: 0;
                        }

                        .print-sales-report table {
                            width: 100%;
                            border-collapse: collapse;
                            font-size: 9px;
                        }

                        .print-sales-report th,
                        .print-sales-report td {
                            border: 1px solid #000;
                            padding: 5px;
                            text-align: center;
                        }

                        .print-sales-report th {
                            font-weight: bold;
                        }

                        .print-total {
                            width: 300px;
                            margin-left: auto;
                            margin-top: 20px;
                            border: 1px solid #000;
                            padding: 10px;
                        }

                        .print-total div {
                            display: flex;
                            justify-content: space-between;
                            padding: 5px 0;
                        }

                        .print-total .grand-total {
                            border-top: 1px solid #000;
                            margin-top: 5px;
                            padding-top: 8px;
                            font-size: 15px;
                        }

                        .print-footer {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 12px;
                        }
                    }
                `}
            </style>

        </>
    );
}

export default SalesReport;