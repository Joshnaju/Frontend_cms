import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function PharmacistDashboard() {

    const navigate = useNavigate();

    const [totalMedicines, setTotalMedicines] = useState(0);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [todayBills, setTodayBills] = useState(0);
    const [todaySales, setTodaySales] = useState(0);

    const [lowStockMedicines, setLowStockMedicines] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // LOAD DASHBOARD DATA
    // =====================================================

    const loadDashboardData = async () => {

        try {

            setLoading(true);
            setError("");


            // -------------------------------------------------
            // GET MEDICINES
            // -------------------------------------------------

            const medicineResponse = await api.get(
                "medicine-master/medicines/"
            );

            setTotalMedicines(
                medicineResponse.data.length
            );


            // -------------------------------------------------
            // GET LOW STOCK
            // -------------------------------------------------

            const lowStockResponse = await api.get(
                "pharmacy/alerts/low-stock/"
            );

            setLowStockCount(
                lowStockResponse.data.total_low_stock_medicines || 0
            );

            setLowStockMedicines(
                lowStockResponse.data.records || []
            );


            // -------------------------------------------------
            // GET TODAY'S SALES
            // -------------------------------------------------

            const salesResponse = await api.get(
                "pharmacy/reports/sales/",
                {
                    params: {
                        period: "daily"
                    }
                }
            );

            setTodayBills(
                salesResponse.data.total_bills || 0
            );

            setTodaySales(
                Number(
                    salesResponse.data.total_sales || 0
                )
            );


        } catch (error) {

            console.error(error);

            setError(
                "Unable to load dashboard data."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        loadDashboardData();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="container mt-4">

                <h2 className="mb-4">
                    Pharmacist Dashboard
                </h2>

                <p>
                    Loading dashboard...
                </p>

            </div>

        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="container mt-4">

                <h2 className="mb-4">
                    Pharmacist Dashboard
                </h2>

                <div className="alert alert-danger">
                    {error}
                </div>

                <button
                    className="btn btn-primary"
                    onClick={loadDashboardData}
                >
                    Retry
                </button>

            </div>

        );
    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="container-fluid mt-4 px-4">

            {/* ============================================
                HEADER
            ============================================ */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Pharmacist Dashboard
                    </h2>

                    <p className="text-muted mb-0">
                        Manage medicines, inventory and pharmacy sales
                    </p>

                </div>

                <button
                    className="btn btn-outline-primary"
                    onClick={loadDashboardData}
                >
                    ↻ Refresh
                </button>

            </div>


            {/* ============================================
                DASHBOARD CARDS
            ============================================ */}

            <div className="row g-4 mb-4">


                {/* TOTAL MEDICINES */}

                <div className="col-md-6 col-xl-3">

                    <div
                        className="card border-0 shadow-sm h-100"
                        style={{ borderRadius: "15px" }}
                    >

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-1">
                                        Total Medicines
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        {totalMedicines}
                                    </h2>

                                </div>

                                <div
                                    className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "55px",
                                        height: "55px"
                                    }}
                                >

                                    <span
                                        className="fs-3 text-primary"
                                    >
                                        💊
                                    </span>

                                </div>

                            </div>

                            <button
                                className="btn btn-sm btn-outline-primary mt-3"
                                onClick={() =>
                                    navigate("/pharmacist/medicines")
                                }
                            >
                                View Medicines
                            </button>

                        </div>

                    </div>

                </div>


                {/* LOW STOCK */}

                <div className="col-md-6 col-xl-3">

                    <div
                        className="card border-0 shadow-sm h-100"
                        style={{ borderRadius: "15px" }}
                    >

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-1">
                                        Low Stock
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        {lowStockCount}
                                    </h2>

                                </div>

                                <div
                                    className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "55px",
                                        height: "55px"
                                    }}
                                >

                                    <span className="fs-3">
                                        ⚠️
                                    </span>

                                </div>

                            </div>

                            <button
                                className="btn btn-sm btn-outline-danger mt-3"
                                onClick={() =>
                                    navigate("/pharmacist/low-stock")
                                }
                            >
                                View Alerts
                            </button>

                        </div>

                    </div>

                </div>


                {/* TODAY'S BILLS */}

                <div className="col-md-6 col-xl-3">

                    <div
                        className="card border-0 shadow-sm h-100"
                        style={{ borderRadius: "15px" }}
                    >

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-1">
                                        Today's Bills
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        {todayBills}
                                    </h2>

                                </div>

                                <div
                                    className="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "55px",
                                        height: "55px"
                                    }}
                                >

                                    <span className="fs-3">
                                        🧾
                                    </span>

                                </div>

                            </div>

                            <button
                                className="btn btn-sm btn-outline-warning mt-3"
                                onClick={() =>
                                    navigate("/pharmacist/bills")
                                }
                            >
                                View Bills
                            </button>

                        </div>

                    </div>

                </div>


                {/* TODAY'S SALES */}

                <div className="col-md-6 col-xl-3">

                    <div
                        className="card border-0 shadow-sm h-100"
                        style={{ borderRadius: "15px" }}
                    >

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-1">
                                        Today's Sales
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        ₹{todaySales.toFixed(2)}
                                    </h2>

                                </div>

                                <div
                                    className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "55px",
                                        height: "55px"
                                    }}
                                >

                                    <span className="fs-3">
                                        💰
                                    </span>

                                </div>

                            </div>

                            <button
                                className="btn btn-sm btn-outline-success mt-3"
                                onClick={() =>
                                    navigate("/pharmacist/sales-report")
                                }
                            >
                                Sales Report
                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* ============================================
                LOW STOCK SECTION
            ============================================ */}

            <div className="card border-0 shadow-sm">

                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <div>

                            <h4 className="fw-bold mb-1">
                                ⚠️ Low Stock Medicines
                            </h4>

                            <p className="text-muted mb-0">
                                Medicines that need to be reordered
                            </p>

                        </div>

                        <button
                            className="btn btn-outline-danger"
                            onClick={() =>
                                navigate("/pharmacist/low-stock")
                            }
                        >
                            View All
                        </button>

                    </div>


                    {lowStockMedicines.length === 0 ? (

                        <div className="alert alert-success mb-0">

                            ✓ All medicines have sufficient stock.

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead className="table-light">

                                    <tr>

                                        <th>
                                            Medicine
                                        </th>

                                        <th>
                                            Current Stock
                                        </th>

                                        <th>
                                            Minimum Stock
                                        </th>

                                        <th>
                                            Maximum Stock
                                        </th>

                                        <th>
                                            Reorder Quantity
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {lowStockMedicines
                                        .slice(0, 5)
                                        .map((medicine) => (

                                            <tr
                                                key={
                                                    medicine.inventory_id
                                                }
                                            >

                                                <td>

                                                    <strong>
                                                        {
                                                            medicine.medicine_name
                                                        }
                                                    </strong>

                                                </td>

                                                <td>

                                                    <span className="text-danger fw-bold">

                                                        {
                                                            medicine.current_stock
                                                        }

                                                    </span>

                                                </td>

                                                <td>
                                                    {
                                                        medicine.min_stock
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        medicine.max_stock
                                                    }
                                                </td>

                                                <td>

                                                    <span className="fw-bold">

                                                        {
                                                            medicine.reorder_quantity
                                                        }

                                                    </span>

                                                </td>

                                                <td>

                                                    <span className="badge bg-danger">

                                                        {
                                                            medicine.status
                                                        }

                                                    </span>

                                                </td>

                                            </tr>

                                        ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>


            {/* ============================================
                QUICK ACTIONS
            ============================================ */}

            <div className="row g-4 mt-2 mb-4">

                <div className="col-md-4">

                    <button
                        className="btn btn-outline-primary w-100 p-3"
                        onClick={() =>
                            navigate("/pharmacist/inventory")
                        }
                    >
                        📦 Manage Inventory
                    </button>

                </div>

                <div className="col-md-4">

                    <button
                        className="btn btn-outline-secondary w-100 p-3"
                        onClick={() =>
                            navigate("/pharmacist/prescriptions")
                        }
                    >
                        📋 Search Prescriptions
                    </button>

                </div>

                <div className="col-md-4">

                    <button
                        className="btn btn-outline-success w-100 p-3"
                        onClick={() =>
                            navigate("/pharmacist/sales-report")
                        }
                    >
                        📊 View Sales Report
                    </button>

                </div>

            </div>

        </div>

    );
}

export default PharmacistDashboard;