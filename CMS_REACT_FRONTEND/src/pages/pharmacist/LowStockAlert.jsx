import { useEffect, useState } from "react";
import api from "../../services/api";

function LowStockAlert() {

    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // GET LOW STOCK MEDICINES
    // =====================================================

    const loadLowStockMedicines = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "pharmacy/alerts/low-stock/"
            );

            setMedicines(response.data.records || []);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load low stock medicines."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD DATA WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        loadLowStockMedicines();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="container mt-4">

                <h2>
                    Low Stock Alert
                </h2>

                <p>
                    Loading...
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

                <h2>
                    Low Stock Alert
                </h2>

                <div className="alert alert-danger">
                    {error}
                </div>

                <button
                    className="btn btn-primary"
                    onClick={loadLowStockMedicines}
                >
                    Retry
                </button>

            </div>
        );
    }


    // =====================================================
    // DISPLAY
    // =====================================================

    return (

        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>
                    Low Stock Alert
                </h2>

                <button
                    className="btn btn-primary"
                    onClick={loadLowStockMedicines}
                >
                    Refresh
                </button>

            </div>


            {/* ============================================
                NO LOW STOCK MEDICINES
            ============================================ */}

            {medicines.length === 0 ? (

                <div className="alert alert-success">

                    <strong>
                        ✓ All medicines have sufficient stock.
                    </strong>

                </div>

            ) : (

                <>

                    {/* ====================================
                        ALERT MESSAGE
                    ==================================== */}

                    <div className="alert alert-warning">

                        <strong>
                            ⚠ Low Stock Alert
                        </strong>

                        <br />

                        {medicines.length} medicine(s)
                        require attention.

                    </div>


                    {/* ====================================
                        LOW STOCK TABLE
                    ==================================== */}

                    <div className="card">

                        <div className="card-body">

                            <div className="table-responsive">

                                <table className="table table-bordered table-hover">

                                    <thead className="table-light">

                                        <tr>

                                            <th>
                                                S.No
                                            </th>

                                            <th>
                                                Medicine ID
                                            </th>

                                            <th>
                                                Medicine Name
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

                                        {medicines.map(
                                            (medicine, index) => (

                                                <tr
                                                    key={
                                                        medicine.inventory_id
                                                    }
                                                >

                                                    <td>
                                                        {index + 1}
                                                    </td>

                                                    <td>
                                                        {medicine.medicine_id}
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {
                                                                medicine.medicine_name
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {
                                                            medicine.current_stock
                                                        }
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
                                                        {
                                                            medicine.reorder_quantity
                                                        }
                                                    </td>

                                                    <td>

                                                        <span className="badge bg-danger">

                                                            {
                                                                medicine.status
                                                            }

                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>

                </>

            )}

        </div>

    );
}

export default LowStockAlert;