import { Routes, Route, Navigate } from "react-router-dom";

import PharmacistLayout from "../components/pharmacist/PharmacistLayout";

import PharmacistDashboard from "../pages/pharmacist/PharmacistDashboard";
import MedicineList from "../pages/pharmacist/MedicineList";
import MedicineInventory from "../pages/pharmacist/MedicineInventory";
import PrescriptionSearch from "../pages/pharmacist/PrescriptionSearch";
import PharmacyBills from "../pages/pharmacist/PharmacyBills";
import SalesReport from "../pages/pharmacist/SalesReport";
import LowStockAlert from "../pages/pharmacist/LowStockAlert";

function PharmacistRoutes() {
  return (
    <Routes>

      <Route element={<PharmacistLayout />}>

        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        {/* DASHBOARD */}
        <Route
          path="dashboard"
          element={<PharmacistDashboard />}
        />

        {/* MEDICINES */}
        <Route
          path="medicines"
          element={<MedicineList />}
        />

        {/* MEDICINE INVENTORY */}
        <Route
          path="inventory"
          element={<MedicineInventory />}
        />

        {/* PRESCRIPTIONS */}
        <Route
          path="prescriptions"
          element={<PrescriptionSearch />}
        />

        {/* PHARMACY BILLS */}
        <Route
          path="bills"
          element={<PharmacyBills />}
        />

        {/* SALES REPORT */}
        <Route
          path="sales-report"
          element={<SalesReport />}
        />

        {/* LOW STOCK ALERT */}
        <Route
          path="low-stock"
          element={<LowStockAlert />}
        />

      </Route>

    </Routes>
  );
}

export default PharmacistRoutes;