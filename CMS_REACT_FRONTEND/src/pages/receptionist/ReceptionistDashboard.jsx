function ReceptionistDashboard() {
  const name =
    localStorage.getItem("name") ||
    localStorage.getItem("username") ||
    "Receptionist";

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
        You are logged in as Receptionist.
      </h5>

      <p className="text-muted">
        You can manage patients, appointments and consultation bills from the menu.
      </p>
    </div>
  );
}

export default ReceptionistDashboard;


