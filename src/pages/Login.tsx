import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <div className="card" style={styles.formCard}>
          <div style={styles.header}>
            <div style={styles.iconWrapper}>
              <LogIn size={32} color="var(--primary)" />
            </div>
            <h2 style={styles.title}>Welcome Back</h2>
            <p style={styles.subtitle}>Login to access your account</p>
          </div>

          {error && <div style={styles.errorAlert}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@example.com"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Don't have an account?{" "}
              <Link to="/signup" style={styles.link}>
                Sign up here
              </Link>
            </p>
          </div>

          <div style={styles.demoAccounts}>
            <p style={styles.demoTitle}>Demo Accounts:</p>
            <p style={styles.demoText}>Admin: admin@barangay.com / admin123</p>
            <p style={styles.demoText}>
              Resident: resident@barangay.com / resident123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "450px",
  },
  formCard: {
    padding: "2.5rem",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  iconWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "var(--text-primary)",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "var(--text-secondary)",
  },
  errorAlert: {
    background: "#FEE2E2",
    color: "#991B1B",
    padding: "1rem",
    borderRadius: "6px",
    marginBottom: "1.5rem",
    fontSize: "0.95rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontWeight: "500",
    color: "var(--text-primary)",
  },
  submitBtn: {
    width: "100%",
    marginTop: "1rem",
  },
  footer: {
    marginTop: "2rem",
    textAlign: "center",
  },
  footerText: {
    color: "var(--text-secondary)",
  },
  link: {
    color: "var(--primary)",
    fontWeight: "500",
  },
  demoAccounts: {
    marginTop: "2rem",
    padding: "1rem",
    background: "var(--background)",
    borderRadius: "6px",
  },
  demoTitle: {
    fontWeight: "600",
    marginBottom: "0.5rem",
    color: "var(--text-primary)",
  },
  demoText: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    margin: "0.25rem 0",
  },
};

export default Login;
