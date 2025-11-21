import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FileText, MessageSquare, Calendar, Bell } from "lucide-react";

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const services = [
    {
      icon: <FileText size={48} />,
      title: "Borrow & Return",
      description: "Request to borrow barangay equipment and facilities",
      link: "/services",
      color: "#3B82F6",
    },
    {
      icon: <MessageSquare size={48} />,
      title: "Complaint Center",
      description: "Submit and track your complaints and concerns",
      link: "/complaints",
      color: "#EF4444",
    },
    {
      icon: <Calendar size={48} />,
      title: "Events",
      description: "View and register for barangay events and activities",
      link: "/events",
      color: "#10B981",
    },
    {
      icon: <Bell size={48} />,
      title: "Notifications",
      description: "Stay updated with important announcements",
      link: "/notifications",
      color: "#F59E0B",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div className="container">
          <h1 style={styles.heroTitle}>Welcome to Barangay Online Services</h1>
          <p style={styles.heroSubtitle}>
            {isAuthenticated
              ? `Hello, ${user?.firstName}! Access all barangay services in one place.`
              : "Your one-stop platform for all barangay services and information"}
          </p>
          {!isAuthenticated && (
            <div style={styles.heroCta}>
              <Link
                to="/signup"
                className="btn btn-primary"
                style={styles.ctaBtn}
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="btn btn-outline"
                style={styles.ctaBtn}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Services Grid */}
      <section style={styles.servicesSection}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Our Services</h2>
          <div style={styles.servicesGrid}>
            {services.map((service, index) => (
              <Link
                key={index}
                to={isAuthenticated ? service.link : "/login"}
                style={{
                  ...styles.serviceCard,
                  borderTop: `4px solid ${service.color}`,
                }}
                className="card"
              >
                <div style={{ ...styles.serviceIcon, color: service.color }}>
                  {service.icon}
                </div>
                <h3 style={styles.serviceTitle}>{service.title}</h3>
                <p style={styles.serviceDescription}>{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section style={styles.infoSection}>
        <div className="container">
          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>Quick & Easy</h3>
              <p style={styles.infoText}>
                Access barangay services anytime, anywhere. No need to visit the
                office for simple requests.
              </p>
            </div>
            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>Track Your Requests</h3>
              <p style={styles.infoText}>
                Monitor the status of your service requests and complaints in
                real-time.
              </p>
            </div>
            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>Stay Informed</h3>
              <p style={styles.infoText}>
                Get instant notifications about events, announcements, and
                updates from your barangay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container">
          <p style={styles.footerText}>
            © 2024 Barangay Online Services. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "calc(100vh - 64px)",
  },
  hero: {
    background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
    color: "white",
    padding: "4rem 0",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  heroSubtitle: {
    fontSize: "1.25rem",
    marginBottom: "2rem",
    opacity: 0.9,
  },
  heroCta: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  ctaBtn: {
    fontSize: "1.1rem",
    padding: "1rem 2rem",
  },
  servicesSection: {
    padding: "4rem 0",
  },
  sectionTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "3rem",
    color: "var(--text-primary)",
  },
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
  },
  serviceCard: {
    textAlign: "center",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
  },
  serviceIcon: {
    marginBottom: "1rem",
  },
  serviceTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "0.75rem",
    color: "var(--text-primary)",
  },
  serviceDescription: {
    color: "var(--text-secondary)",
    lineHeight: "1.6",
  },
  infoSection: {
    background: "var(--background)",
    padding: "4rem 0",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
  },
  infoCard: {
    textAlign: "center",
  },
  infoTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "var(--primary)",
  },
  infoText: {
    color: "var(--text-secondary)",
    lineHeight: "1.6",
  },
  footer: {
    background: "var(--text-primary)",
    color: "white",
    padding: "2rem 0",
    textAlign: "center",
  },
  footerText: {
    margin: 0,
  },
};

// Add hover effect
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  }
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem !important;
    }
    h2 {
      font-size: 1.75rem !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Home;
