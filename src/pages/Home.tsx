import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AnimatedBackground from "../components/AnimatedBackground";
import {
  ServiceIcon,
  ComplaintIcon,
  EventIcon,
  NotificationIcon,
} from "../components/CustomIcons";

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const services = [
    {
      icon: <ServiceIcon size={64} />,
      title: "Borrow & Return",
      description: "Request to borrow barangay equipment and facilities",
      link: "/services",
      color: "#3B82F6",
      gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
    },
    {
      icon: <ComplaintIcon size={64} />,
      title: "Complaint Center",
      description: "Submit and track your complaints and concerns",
      link: "/complaints",
      color: "#EF4444",
      gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    },
    {
      icon: <EventIcon size={64} />,
      title: "Events",
      description: "View and register for barangay events and activities",
      link: "/events",
      color: "#10B981",
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    },
    {
      icon: <NotificationIcon size={64} />,
      title: "Notifications",
      description: "Stay updated with important announcements",
      link: "/notifications",
      color: "#F59E0B",
      gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <AnimatedBackground />
        <div className="container" style={styles.heroContent}>
          <div className="fade-in">
            <h1 style={styles.heroTitle}>
              Welcome to Barangay Online Services
            </h1>
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
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 10h12m0 0l-4-4m4 4l-4 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline"
                  style={styles.ctaBtnOutline}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={styles.servicesSection}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Our Services</h2>
          <p style={styles.sectionSubtitle}>
            Everything you need for barangay services, all in one place
          </p>
          <div style={styles.servicesGrid}>
            {services.map((service, index) => (
              <Link
                key={index}
                to={isAuthenticated ? service.link : "/login"}
                style={styles.serviceCard}
                className="service-card"
              >
                <div style={styles.serviceIconWrapper}>{service.icon}</div>
                <h3 style={styles.serviceTitle}>{service.title}</h3>
                <p style={styles.serviceDescription}>{service.description}</p>
                <div style={styles.serviceArrow}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12h14m0 0l-6-6m6 6l-6 6"
                      stroke={service.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div className="container">
          <div style={styles.featuresGrid}>
            <div className="feature-card" style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="24" cy="24" r="20" fill="#3B82F6" opacity="0.1" />
                  <path
                    d="M16 24l6 6 12-12"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Quick & Easy</h3>
              <p style={styles.featureText}>
                Access barangay services anytime, anywhere. No need to visit the
                office for simple requests.
              </p>
            </div>
            <div className="feature-card" style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="24" cy="24" r="20" fill="#10B981" opacity="0.1" />
                  <path
                    d="M24 14v20m-10-6l10 6 10-6"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Track Your Requests</h3>
              <p style={styles.featureText}>
                Monitor the status of your service requests and complaints in
                real-time.
              </p>
            </div>
            <div className="feature-card" style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="24" cy="24" r="20" fill="#F59E0B" opacity="0.1" />
                  <path
                    d="M24 16v12l6 4"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="10"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Stay Informed</h3>
              <p style={styles.featureText}>
                Get instant notifications about events, announcements, and
                updates from your barangay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div className="container">
          <div style={styles.statsGrid}>
            <div className="stat-card" style={styles.statCard}>
              <div style={styles.statNumber}>1000+</div>
              <div style={styles.statLabel}>Active Users</div>
            </div>
            <div className="stat-card" style={styles.statCard}>
              <div style={styles.statNumber}>500+</div>
              <div style={styles.statLabel}>Services Completed</div>
            </div>
            <div className="stat-card" style={styles.statCard}>
              <div style={styles.statNumber}>50+</div>
              <div style={styles.statLabel}>Events Hosted</div>
            </div>
            <div className="stat-card" style={styles.statCard}>
              <div style={styles.statNumber}>24/7</div>
              <div style={styles.statLabel}>Available Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container">
          <div style={styles.footerContent}>
            <div style={styles.footerSection}>
              <h4 style={styles.footerTitle}>Barangay Services</h4>
              <p style={styles.footerText}>
                Making community services accessible to everyone
              </p>
            </div>
            <div style={styles.footerSection}>
              <h4 style={styles.footerTitle}>Quick Links</h4>
              <div style={styles.footerLinks}>
                <Link to="/services" style={styles.footerLink}>
                  Services
                </Link>
                <Link to="/events" style={styles.footerLink}>
                  Events
                </Link>
                <Link to="/complaints" style={styles.footerLink}>
                  Complaints
                </Link>
              </div>
            </div>
            <div style={styles.footerSection}>
              <h4 style={styles.footerTitle}>Contact</h4>
              <p style={styles.footerText}>barangay@example.com</p>
              <p style={styles.footerText}>+63 123 456 7890</p>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <p style={styles.footerCopyright}>
              © 2024 Barangay Online Services. All rights reserved.
            </p>
          </div>
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
    position: "relative",
    background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
    color: "white",
    padding: "6rem 0",
    textAlign: "center",
    overflow: "hidden",
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
  },
  heroTitle: {
    fontSize: "3.5rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    lineHeight: "1.2",
    textShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
  heroSubtitle: {
    fontSize: "1.4rem",
    marginBottom: "2.5rem",
    opacity: 0.95,
    maxWidth: "700px",
    margin: "0 auto 2.5rem",
  },
  heroCta: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  ctaBtn: {
    fontSize: "1.1rem",
    padding: "1rem 2.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  ctaBtnOutline: {
    fontSize: "1.1rem",
    padding: "1rem 2.5rem",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    border: "2px solid white",
    color: "white",
  },
  servicesSection: {
    padding: "5rem 0",
    background: "var(--background)",
  },
  sectionTitle: {
    fontSize: "2.8rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "1rem",
    color: "var(--text-primary)",
  },
  sectionSubtitle: {
    fontSize: "1.2rem",
    textAlign: "center",
    marginBottom: "3rem",
    color: "var(--text-secondary)",
  },
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
  },
  serviceCard: {
    background: "var(--surface)",
    borderRadius: "16px",
    padding: "2.5rem 2rem",
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
  serviceIconWrapper: {
    marginBottom: "1.5rem",
    display: "flex",
    justifyContent: "center",
  },
  serviceTitle: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "var(--text-primary)",
  },
  serviceDescription: {
    color: "var(--text-secondary)",
    lineHeight: "1.7",
    marginBottom: "1.5rem",
  },
  serviceArrow: {
    display: "flex",
    justifyContent: "center",
    opacity: 0,
    transform: "translateX(-10px)",
    transition: "all 0.3s ease",
  },
  featuresSection: {
    padding: "5rem 0",
    background: "var(--surface)",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "3rem",
  },
  featureCard: {
    textAlign: "center",
    padding: "2rem",
  },
  featureIcon: {
    marginBottom: "1.5rem",
    display: "flex",
    justifyContent: "center",
  },
  featureTitle: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "var(--text-primary)",
  },
  featureText: {
    color: "var(--text-secondary)",
    lineHeight: "1.7",
    fontSize: "1.05rem",
  },
  statsSection: {
    padding: "5rem 0",
    background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
    color: "white",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "2rem",
  },
  statCard: {
    textAlign: "center",
    padding: "2rem",
  },
  statNumber: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  statLabel: {
    fontSize: "1.1rem",
    opacity: 0.9,
  },
  footer: {
    background: "var(--text-primary)",
    color: "white",
    padding: "3rem 0 1rem",
  },
  footerContent: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
    marginBottom: "2rem",
  },
  footerSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  footerTitle: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  footerText: {
    opacity: 0.8,
    lineHeight: "1.6",
  },
  footerLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  footerLink: {
    opacity: 0.8,
    transition: "opacity 0.2s",
  },
  footerBottom: {
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: "1.5rem",
    textAlign: "center",
  },
  footerCopyright: {
    opacity: 0.7,
  },
};

// Add enhanced animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .service-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3B82F6, #10B981, #F59E0B, #EF4444);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  .service-card:hover::before {
    transform: scaleX(1);
  }
  
  .service-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  }
  
  .service-card:hover .serviceArrow {
    opacity: 1;
    transform: translateX(0);
  }
  
  .feature-card {
    transition: transform 0.3s ease;
  }
  
  .feature-card:hover {
    transform: scale(1.05);
  }
  
  .stat-card {
    transition: transform 0.3s ease;
  }
  
  .stat-card:hover {
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 2.2rem !important;
    }
    h2 {
      font-size: 2rem !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Home;
