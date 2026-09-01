import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/loginService";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await login({
        username,
        password,
      });

      const data = response.data;

      // Save in localStorage
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("username", data.username);
      localStorage.setItem("name", data.name);
      localStorage.setItem("role", data.role);

      // Update React state immediately
      setUser({
        access: data.access,
        refresh: data.refresh,
        username: data.username,
        name: data.name,
        role: data.role,
      });

      // Role based navigation
      switch (data.role) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;

        case "DOCTOR":
          navigate("/doctor/dashboard");
          break;

        case "RECEPTIONIST":
          navigate("/receptionist/dashboard");
          break;

        case "PHARMACIST":
          navigate("/pharmacist/dashboard");
          break;

        case "LAB_TECHNICIAN":
          navigate("/lab/dashboard");
          break;

        default:
          setError("Invalid user role");
      }
    } catch (err) {
      console.log("LOGIN ERROR:", err);

      setError(err.response?.data?.message || "Invalid username or password");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (token && role && name) {
      switch (role) {
        case "DOCTOR":
          navigate("/doctor/dashboard", { replace: true });
          break;

        case "ADMIN":
          navigate("/admin/dashboard", { replace: true });
          break;

        case "RECEPTIONIST":
          navigate("/receptionist/dashboard", { replace: true });
          break;

        case "PHARMACIST":
          navigate("/pharmacist/dashboard", { replace: true });
          break;

        case "LAB_TECHNICIAN":
          navigate("/lab/dashboard", { replace: true });
          break;

        default:
          break;
      }
    }
  }, [navigate]);

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <div className="card shadow">
        <div className="card-header text-center">
          <h3>Login</h3>
        </div>

        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Username</label>

              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>

              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
