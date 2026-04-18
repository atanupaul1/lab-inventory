import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../context/AppContext";
import AuthLayout from "../components/AuthLayout";
import { FiUser, FiMail, FiLock, FiShield, FiArrowRight, FiChevronDown } from "react-icons/fi";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.password) {
      return setError("Please fill in all fields");
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/");
      } else {
        const msg = typeof data.detail === "string" 
          ? data.detail 
          : (Array.isArray(data.detail) ? data.detail[0].msg : "Registration failed");
        setError(msg);
      }
    } catch (err) {
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join LabFlow to manage your lab resources"
      alternativeLink="/"
      alternativeText="Already have an account?"
      image="/Welcome.png"
    >
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <div style={styles.inputWrapper}>
            <FiUser style={styles.inputIcon} />
            <input
              name="full_name"
              type="text"
              placeholder="John Doe"
              className="input-field"
              value={formData.full_name}
              onChange={handleChange}
              style={{ paddingLeft: "44px" }}
            />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <div style={styles.inputWrapper}>
            <FiMail style={styles.inputIcon} />
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              style={{ paddingLeft: "44px" }}
            />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <div style={styles.inputWrapper}>
            <FiLock style={styles.inputIcon} />
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              style={{ paddingLeft: "44px" }}
            />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Joining As</label>
          <div style={styles.inputWrapper}>
            <FiShield style={styles.inputIcon} />
            <select
              name="role"
              className="input-field"
              value={formData.role}
              onChange={handleChange}
              style={{ paddingLeft: "44px", appearance: "none", cursor: "pointer" }}
            >
              <option value="student">Student</option>
              <option value="admin">Administrator</option>
            </select>
            <FiChevronDown style={styles.dropdownArrow} />
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading}
          style={{ width: "100%", height: "48px", marginTop: "12px" }}
        >
          {loading ? "Creating account..." : (
            <>
              <span>Create Account</span>
              <FiArrowRight />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}

const styles = {
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--color-text-secondary)",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "16px",
    color: "var(--color-text-dim)",
    fontSize: "18px",
  },
  error: {
    padding: "12px",
    background: "var(--color-danger-soft)",
    color: "var(--color-danger)",
    borderRadius: "12px",
    fontSize: "13px",
    textAlign: "center",
    fontWeight: "500",
    border: "1px solid rgba(239, 68, 68, 0.2)",
  },
  dropdownArrow: {
    position: "absolute",
    right: "16px",
    color: "var(--color-text-dim)",
    pointerEvents: "none",
    fontSize: "18px",
  }
};

export default Register;