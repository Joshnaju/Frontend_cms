function PharmacistDashboard() {
  const name =
    localStorage.getItem("name") ||
    localStorage.getItem("username") ||
    "Pharmacist";

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        minHeight: "calc(100vh - 120px)",
      }}
    >
      <h2 className="fw-bold mb-3">
        Welcome, {name} 👋
      </h2>

      <h5 className="mb-3">
        You are logged in as Pharmacist.
      </h5>

      <p className="text-muted">
        You can manage medicines, prescriptions, pharmacy bills and inventory from the menu.
      </p>
    </div>
  );
}

export default PharmacistDashboard;