import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdminLoginMutation } from '../features/apiSlice'; // Adjust the path as per your project structure

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Hook from RTK Query for login
  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await adminLogin({ username, password }).unwrap();

      if (response.success) {
        localStorage.setItem("admin-token", response.token);
        toast.success("Login successful!");
        navigate("/"); // Navigate to dashboard
      } else {
        toast.error(response.message || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Logging in..." : "Admin Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

