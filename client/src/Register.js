import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('${process.env.REACT_APP_API_URL}/api/auth/register', {
        name,
        email,
        password,
        role
      });

      alert("Registration successful 🎉 Please login.");
      navigate("/login");

    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Register</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ marginBottom: "15px", padding: "12px", borderRadius: "8px" }}
        >
          <option value="candidate">Candidate</option>
          <option value="employer">Employer</option>
        </select>

        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

export default Register;
