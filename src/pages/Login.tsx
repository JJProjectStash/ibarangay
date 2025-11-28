import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, Eye, EyeOff } from "lucide-react";
import EnhancedInput from "../components/EnhancedInput";
import { showToast } from "../utils/toast";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const devLogin = (role: 'admin' | 'staff' | 'resident') => {
    if (!import.meta.env.DEV) return;

    const user = {
      _id: `dev-${role}-id`,
      id: `dev-${role}-id`,
      firstName: role === 'admin' ? 'Admin' : role === 'staff' ? 'Staff' : 'Resident',
      lastName: 'User',
      email: `${role}@dev.local`,
      role,
      address: '123 Dev Lane',
      phoneNumber: '09171234567',
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('token', `dev-token-${role}`);
    localStorage.setItem('user', JSON.stringify(user));

    // reload so AuthProvider can rehydrate from localStorage
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      showToast("Login successful!", "success");
      navigate("/");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.formWrapper}>
        <div className="card" style={styles.formCard}>
          <div style={styles.header}>
            <div style={styles.iconWrapper}>
              <LogIn size={32} color="var(--primary)" />
            </div>
            <h2 style={styles.title}>Welcome Back</h2>
            <p style={styles.subtitle}>Login to access your account</p>
          </div>

          {error && (
            <div style={styles.errorAlert} className="slide-in-right">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <EnhancedInput
                id="login-email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="juan@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <EnhancedInput
                  id="login-password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  className="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div style={styles.spinner} />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
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
            <p style={styles.demoTitle}>🎯 Demo Accounts:</p>
            <p style={styles.demoText}>
              👨‍💼 Admin: admin@barangay.com / admin123
            </p>
            <p style={styles.demoText}>
              👤 Resident: resident@barangay.com / resident123
            </p>
          </div>
          {import.meta.env.DEV && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontWeight: 600 }}>Dev Login (Local only):</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => devLogin('admin')}
                >
                  Login as Admin (dev)
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => devLogin('staff')}
                >
                  Login as Staff (dev)
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => devLogin('resident')}
                >
                  Login as Resident (dev)
                </button>
              </div>
            </div>
          )}
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
    background: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
    color: "#991B1B",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    fontSize: "0.95rem",
    fontWeight: "500",
    border: "1px solid #FCA5A5",
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
  passwordWrapper: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    padding: "0.25rem",
    display: "flex",
    alignItems: "center",
  },
  submitBtn: {
    width: "100%",
    marginTop: "1rem",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
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
    fontWeight: "600",
  },
  demoAccounts: {
    marginTop: "2rem",
    padding: "1rem",
    background: "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
    borderRadius: "8px",
    border: "1px solid var(--border)",
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
