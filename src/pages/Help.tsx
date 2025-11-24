/**
 * Help & User Guide Page
 *
 * Provides comprehensive documentation and guidance for all user roles.
 * Includes FAQs, feature guides, and troubleshooting information.
 */

import { useState } from "react";
import {
  Book,
  HelpCircle,
  FileText,
  Users,
  Settings,
  MessageSquare,
  Calendar,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string[];
}

const Help = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const guideSections: GuideSection[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Book size={20} />,
      content: [
        "Welcome to iBarangay! This guide will help you navigate the platform.",
        "1. Complete your profile in Settings to ensure accurate information",
        "2. Explore the Dashboard to see available services and announcements",
        "3. Use the navigation menu to access different features",
        "4. Enable notifications to stay updated on important events",
      ],
    },
    {
      id: "complaints",
      title: "Filing Complaints",
      icon: <MessageSquare size={20} />,
      content: [
        "How to file a complaint:",
        "1. Navigate to Complaints → New Complaint",
        "2. Fill in the required details (title, description, category)",
        "3. Select priority level (low, medium, high)",
        "4. Attach photos or documents if needed",
        "5. Submit and track your complaint status",
        "",
        "Complaint Status Guide:",
        "• Pending: Your complaint has been received and is awaiting assignment",
        "• In Progress: A staff member is actively working on your complaint",
        "• Resolved: The issue has been addressed",
        "• Closed: The complaint has been finalized",
      ],
    },
    {
      id: "services",
      title: "Requesting Services",
      icon: <FileText size={20} />,
      content: [
        "How to request barangay services:",
        "1. Go to Services → New Request",
        "2. Select the item type you need to borrow",
        "3. Specify borrow date and expected return date",
        "4. Provide purpose and quantity",
        "5. Submit your request",
        "",
        "Service Request Status:",
        "• Pending: Request is under review",
        "• Approved: Request has been approved, ready for pickup",
        "• Borrowed: Item is currently in your possession",
        "• Returned: Item has been returned",
        "• Rejected: Request was not approved (reason provided)",
      ],
    },
    {
      id: "events",
      title: "Events & Registration",
      icon: <Calendar size={20} />,
      content: [
        "Participating in barangay events:",
        "1. Browse upcoming events on the Events page",
        "2. Click on an event to view details",
        "3. Click 'Register' to sign up for the event",
        "4. You'll receive a confirmation notification",
        "5. Check your registered events in your profile",
        "",
        "Event Categories:",
        "• Community: Town hall meetings, clean-up drives",
        "• Sports: Basketball tournaments, fun runs",
        "• Cultural: Festivals, celebrations",
        "• Health: Medical missions, health seminars",
        "• Education: Workshops, training sessions",
      ],
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: <Bell size={20} />,
      content: [
        "Managing your notifications:",
        "1. Click the bell icon in the top navigation to view notifications",
        "2. Click on a notification to view details",
        "3. Mark as read or dismiss notifications",
        "4. Use 'Mark All as Read' to clear all notifications",
        "",
        "Notification Types:",
        "• Success: Confirmations and successful actions",
        "• Info: General updates and information",
        "• Warning: Important reminders",
        "• Error: Issues requiring attention",
      ],
    },
    {
      id: "search",
      title: "Global Search",
      icon: <Search size={20} />,
      content: [
        "Using the global search feature:",
        "1. Press Ctrl+K (Windows) or Cmd+K (Mac) to open search",
        "2. Type at least 2 characters to start searching",
        "3. Use arrow keys to navigate results",
        "4. Press Enter to open selected result",
        "5. Press Esc to close search",
        "",
        "Search covers:",
        "• Your complaints and service requests",
        "• Public announcements",
        "• Upcoming events",
        "• Users (admin/staff only)",
      ],
    },
    {
      id: "admin",
      title: "Admin Features",
      icon: <Users size={20} />,
      content: [
        "Admin-specific features:",
        "• User Management: Create, edit, verify, and manage users",
        "• Announcement Management: Create and publish announcements",
        "• Analytics Dashboard: View system statistics and trends",
        "• Audit Logs: Track all system actions and changes",
        "• System Configuration: Manage categories and settings",
        "• Automation Settings: Configure intelligent automation",
        "",
        "Best Practices:",
        "• Verify new user accounts promptly",
        "• Review audit logs regularly",
        "• Keep announcements up-to-date",
        "• Monitor automation performance",
      ],
    },
    {
      id: "staff",
      title: "Staff Features",
      icon: <Settings size={20} />,
      content: [
        "Staff member responsibilities:",
        "• Review and process assigned complaints",
        "• Update complaint status and add responses",
        "• Approve or reject service requests",
        "• Create and manage announcements",
        "• View analytics and performance metrics",
        "",
        "Workflow Tips:",
        "• Check your dashboard daily for new assignments",
        "• Respond to complaints within 24 hours",
        "• Use internal notes for team communication",
        "• Update status regularly to keep residents informed",
        "• Request reassignment if overloaded",
      ],
    },
  ];

  const faqs = [
    {
      question: "How long does it take to process a complaint?",
      answer:
        "Most complaints are reviewed within 24 hours. High-priority complaints are addressed immediately. You'll receive notifications at each status change.",
    },
    {
      question: "Can I edit my complaint after submission?",
      answer:
        "You cannot edit a complaint once submitted, but you can add comments with additional information. If you need to make significant changes, contact staff through the comment section.",
    },
    {
      question: "What if I don't receive a response?",
      answer:
        "If your complaint hasn't been updated in 72 hours, it will be automatically escalated to administrators. You can also manually escalate urgent matters.",
    },
    {
      question: "How do I know if my service request is approved?",
      answer:
        "You'll receive a notification when your request status changes. You can also check the Services page to view the current status of all your requests.",
    },
    {
      question: "Can I cancel an event registration?",
      answer:
        "Yes, you can unregister from an event by going to the event details page and clicking 'Unregister'. This should be done at least 24 hours before the event.",
    },
    {
      question: "How do I change my password?",
      answer:
        "Go to Settings → Security → Change Password. You'll need to enter your current password and choose a new one that meets security requirements.",
    },
    {
      question: "What should I do if I forgot my password?",
      answer:
        "Click 'Forgot Password' on the login page. Enter your email address and follow the instructions sent to your email to reset your password.",
    },
    {
      question: "How can I provide feedback on resolved complaints?",
      answer:
        "Once a complaint is marked as resolved, you can rate it (1-5 stars) and provide feedback. This helps improve service quality.",
    },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const filteredSections = guideSections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.some((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem 0", minHeight: "calc(100vh - 64px)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1 className="text-3xl font-bold" style={{ marginBottom: "0.5rem" }}>
            Help & User Guide
          </h1>
          <p className="text-secondary">
            Everything you need to know about using iBarangay
          </p>
        </div>

        {/* Search */}
        <div
          style={{
            marginBottom: "2rem",
            maxWidth: "600px",
            margin: "0 auto 2rem",
          }}
        >
          <div className="input-group">
            <span className="input-group-text">
              <Search size={20} />
            </span>
            <input
              type="text"
              className="input"
              placeholder="Search help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Guide Sections */}
        <div style={{ marginBottom: "3rem" }}>
          <h2
            className="text-2xl font-semibold"
            style={{ marginBottom: "1.5rem" }}
          >
            User Guides
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {filteredSections.map((section) => (
              <div key={section.id} className="card">
                <button
                  onClick={() => toggleSection(section.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        padding: "0.5rem",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--primary-50)",
                        color: "var(--primary-500)",
                      }}
                    >
                      {section.icon}
                    </div>
                    <span className="font-semibold">{section.title}</span>
                  </div>
                  {expandedSection === section.id ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </button>
                {expandedSection === section.id && (
                  <div
                    style={{
                      padding: "0 1rem 1rem 1rem",
                      borderTop: "1px solid var(--border-color)",
                      marginTop: "0.5rem",
                      paddingTop: "1rem",
                    }}
                  >
                    {section.content.map((item, index) => (
                      <p
                        key={index}
                        style={{
                          marginBottom: item === "" ? "0.5rem" : "0.25rem",
                          color:
                            item.startsWith("•") || item.match(/^\d+\./)
                              ? "var(--text-primary)"
                              : "var(--text-secondary)",
                          fontWeight: item.endsWith(":") ? "600" : "normal",
                        }}
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2
            className="text-2xl font-semibold"
            style={{ marginBottom: "1.5rem" }}
          >
            <HelpCircle
              size={24}
              style={{ display: "inline", marginRight: "0.5rem" }}
            />
            Frequently Asked Questions
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="card">
                <h3
                  className="font-semibold"
                  style={{ marginBottom: "0.5rem" }}
                >
                  {faq.question}
                </h3>
                <p className="text-secondary">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div
          className="card"
          style={{
            marginTop: "3rem",
            backgroundColor: "var(--primary-50)",
            border: "1px solid var(--primary-200)",
            textAlign: "center",
          }}
        >
          <h3 className="font-semibold" style={{ marginBottom: "0.5rem" }}>
            Still need help?
          </h3>
          <p className="text-secondary" style={{ marginBottom: "1rem" }}>
            Contact your barangay administrator for additional support
          </p>
          <button className="btn btn-primary">Contact Support</button>
        </div>
      </div>
    </div>
  );
};

export default Help;
