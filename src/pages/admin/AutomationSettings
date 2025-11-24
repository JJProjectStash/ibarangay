import React, { useState, useEffect } from "react";
import {
  Zap,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Settings,
  Play,
  Pause,
} from "lucide-react";
import autoAssignmentService from "../../utils/autoAssignment";
import { showSuccessToast, showErrorToast } from "../../components/Toast";

interface AutomationConfig {
  autoAssignEnabled: boolean;
  autoEscalationEnabled: boolean;
  workloadBalancingEnabled: boolean;
  escalationThresholdHours: number;
  highPriorityThresholdHours: number;
  maxComplaintsPerStaff: number;
  checkIntervalMinutes: number;
}

const AutomationSettings: React.FC = () => {
  const [config, setConfig] = useState<AutomationConfig>({
    autoAssignEnabled: true,
    autoEscalationEnabled: true,
    workloadBalancingEnabled: true,
    escalationThresholdHours: 72,
    highPriorityThresholdHours: 24,
    maxComplaintsPerStaff: 10,
    checkIntervalMinutes: 60,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [stats, setStats] = useState({
    autoAssignedToday: 0,
    escalatedToday: 0,
    rebalancedToday: 0,
  });

  useEffect(() => {
    // Load config from localStorage
    const savedConfig = localStorage.getItem("automationConfig");
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }

    // Load stats
    const savedStats = localStorage.getItem("automationStats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    // Check if automation is running
    const running = localStorage.getItem("automationRunning") === "true";
    setIsRunning(running);

    if (running) {
      startAutomation();
    }
  }, []);

  const saveConfig = () => {
    localStorage.setItem("automationConfig", JSON.stringify(config));
    showSuccessToast("Automation settings saved successfully!");
  };

  const handleConfigChange = (
    field: keyof AutomationConfig,
    value: boolean | number
  ) => {
    setConfig({ ...config, [field]: value });
  };

  const startAutomation = () => {
    setIsRunning(true);
    localStorage.setItem("automationRunning", "true");
    showSuccessToast("Automation started");

    // Run automation tasks periodically
    const intervalId = setInterval(async () => {
      await runAutomationTasks();
    }, config.checkIntervalMinutes * 60 * 1000);

    // Store interval ID to clear later
    (window as any).automationIntervalId = intervalId;

    // Run immediately
    runAutomationTasks();
  };

  const stopAutomation = () => {
    setIsRunning(false);
    localStorage.setItem("automationRunning", "false");
    showSuccessToast("Automation stopped");

    // Clear interval
    if ((window as any).automationIntervalId) {
      clearInterval((window as any).automationIntervalId);
      (window as any).automationIntervalId = null;
    }
  };

  const runAutomationTasks = async () => {
    try {
      let newStats = { ...stats };

      // Auto-escalation
      if (config.autoEscalationEnabled) {
        await autoAssignmentService.checkAndEscalateOverdue();
        newStats.escalatedToday += 1;
      }

      // Workload balancing
      if (config.workloadBalancingEnabled) {
        await autoAssignmentService.rebalanceWorkload();
        newStats.rebalancedToday += 1;
      }

      setLastRun(new Date());
      setStats(newStats);
      localStorage.setItem("automationStats", JSON.stringify(newStats));
    } catch (error) {
      console.error("Automation task failed:", error);
      showErrorToast("Some automation tasks failed");
    }
  };

  const runManualCheck = async () => {
    showSuccessToast("Running manual automation check...");
    await runAutomationTasks();
    showSuccessToast("Manual check completed!");
  };

  const resetStats = () => {
    const newStats = {
      autoAssignedToday: 0,
      escalatedToday: 0,
      rebalancedToday: 0,
    };
    setStats(newStats);
    localStorage.setItem("automationStats", JSON.stringify(newStats));
    showSuccessToast("Statistics reset");
  };

  return (
    <div style={{ padding: "2rem 0", minHeight: "calc(100vh - 64px)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <h1 className="text-3xl font-bold">Automation Settings</h1>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className={`btn ${isRunning ? "btn-error" : "btn-success"}`}
                onClick={isRunning ? stopAutomation : startAutomation}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {isRunning ? (
                  <>
                    <Pause size={18} /> Stop Automation
                  </>
                ) : (
                  <>
                    <Play size={18} /> Start Automation
                  </>
                )}
              </button>
              <button
                className="btn btn-outline"
                onClick={runManualCheck}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Zap size={18} /> Run Now
              </button>
            </div>
          </div>
          <p className="text-secondary">
            Configure intelligent automation for complaint management
          </p>
          {lastRun && (
            <p
              className="text-sm text-tertiary"
              style={{ marginTop: "0.5rem" }}
            >
              Last run: {lastRun.toLocaleString()}
            </p>
          )}
        </div>

        {/* Status Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: "1.5rem", marginBottom: "2rem" }}
        >
          <div className="card">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-sm text-secondary"
                  style={{ marginBottom: "0.5rem" }}
                >
                  Auto-Assigned Today
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ marginBottom: "0.25rem" }}
                >
                  {stats.autoAssignedToday}
                </p>
              </div>
              <div
                style={{
                  padding: "0.75rem",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--primary-50)",
                  color: "var(--primary-500)",
                }}
              >
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-sm text-secondary"
                  style={{ marginBottom: "0.5rem" }}
                >
                  Escalated Today
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ marginBottom: "0.25rem" }}
                >
                  {stats.escalatedToday}
                </p>
              </div>
              <div
                style={{
                  padding: "0.75rem",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--warning-50)",
                  color: "var(--warning-500)",
                }}
              >
                <AlertTriangle size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-sm text-secondary"
                  style={{ marginBottom: "0.5rem" }}
                >
                  Rebalanced Today
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ marginBottom: "0.25rem" }}
                >
                  {stats.rebalancedToday}
                </p>
              </div>
              <div
                style={{
                  padding: "0.75rem",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--success-50)",
                  color: "var(--success-500)",
                }}
              >
                <TrendingUp size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Configuration */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2
            className="text-xl font-semibold"
            style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Settings size={20} /> Automation Features
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Auto-Assignment */}
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "var(--background-secondary)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <h3
                    className="font-semibold"
                    style={{ marginBottom: "0.5rem" }}
                  >
                    Auto-Assignment
                  </h3>
                  <p className="text-sm text-secondary">
                    Automatically assign new complaints to available staff based
                    on workload and expertise
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={config.autoAssignEnabled}
                    onChange={(e) =>
                      handleConfigChange("autoAssignEnabled", e.target.checked)
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
              {config.autoAssignEnabled && (
                <div>
                  <label className="form-label">
                    Max Complaints Per Staff
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={config.maxComplaintsPerStaff}
                    onChange={(e) =>
                      handleConfigChange(
                        "maxComplaintsPerStaff",
                        parseInt(e.target.value)
                      )
                    }
                    min={1}
                    max={20}
                  />
                </div>
              )}
            </div>

            {/* Auto-Escalation */}
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "var(--background-secondary)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <h3
                    className="font-semibold"
                    style={{ marginBottom: "0.5rem" }}
                  >
                    Auto-Escalation
                  </h3>
                  <p className="text-sm text-secondary">
                    Automatically escalate complaints that remain unresolved for
                    too long
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={config.autoEscalationEnabled}
                    onChange={(e) =>
                      handleConfigChange(
                        "autoEscalationEnabled",
                        e.target.checked
                      )
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
              {config.autoEscalationEnabled && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label className="form-label">
                      Escalation Threshold (hours)
                    </label>
                    <input
                      type="number"
                      className="input"
                      value={config.escalationThresholdHours}
                      onChange={(e) =>
                        handleConfigChange(
                          "escalationThresholdHours",
                          parseInt(e.target.value)
                        )
                      }
                      min={1}
                      max={168}
                    />
                  </div>
                  <div>
                    <label className="form-label">
                      High Priority Threshold (hours)
                    </label>
                    <input
                      type="number"
                      className="input"
                      value={config.highPriorityThresholdHours}
                      onChange={(e) =>
                        handleConfigChange(
                          "highPriorityThresholdHours",
                          parseInt(e.target.value)
                        )
                      }
                      min={1}
                      max={72}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Workload Balancing */}
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "var(--background-secondary)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <h3
                    className="font-semibold"
                    style={{ marginBottom: "0.5rem" }}
                  >
                    Workload Balancing
                  </h3>
                  <p className="text-sm text-secondary">
                    Automatically redistribute complaints to balance workload
                    across staff
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={config.workloadBalancingEnabled}
                    onChange={(e) =>
                      handleConfigChange(
                        "workloadBalancingEnabled",
                        e.target.checked
                      )
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            {/* Check Interval */}
            <div>
              <label className="form-label">
                Automation Check Interval (minutes)
              </label>
              <input
                type="number"
                className="input"
                value={config.checkIntervalMinutes}
                onChange={(e) =>
                  handleConfigChange(
                    "checkIntervalMinutes",
                    parseInt(e.target.value)
                  )
                }
                min={5}
                max={1440}
                style={{ maxWidth: "200px" }}
              />
              <p className="text-sm text-secondary" style={{ marginTop: "0.5rem" }}>
                How often the system should check for automation tasks
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button className="btn btn-outline" onClick={resetStats}>
            Reset Statistics
          </button>
          <button
            className="btn btn-primary"
            onClick={saveConfig}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <CheckCircle size={18} /> Save Settings
          </button>
        </div>

        {/* Info Box */}
        <div
          className="card"
          style={{
            marginTop: "2rem",
            backgroundColor: "var(--info-50)",
            border: "1px solid var(--info-200)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "start",
            }}
          >
            <div
              style={{
                padding: "0.5rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--info-100)",
                color: "var(--info-700)",
              }}
            >
              <Clock size={20} />
            </div>
            <div>
              <h4
                className="font-semibold"
                style={{ marginBottom: "0.5rem", color: "var(--info-900)" }}
              >
                How Automation Works
              </h4>
              <ul
                className="text-sm"
                style={{
                  color: "var(--info-800)",
                  paddingLeft: "1.5rem",
                  lineHeight: "1.6",
                }}
              >
                <li>
                  <strong>Auto-Assignment:</strong> New complaints are
                  automatically assigned to staff with the lowest workload and
                  relevant expertise
                </li>
                <li>
                  <strong>Auto-Escalation:</strong> Complaints pending beyond
                  the threshold are automatically escalated to admins
                </li>
                <li>
                  <strong>Workload Balancing:</strong> The system periodically
                  redistributes complaints to maintain balanced workload
                </li>
                <li>
                  <strong>Smart Prioritization:</strong> High-priority
                  complaints get faster assignment and shorter escalation
                  thresholds
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--gray-300);
          transition: 0.3s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: var(--primary-500);
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }
      `}</style>
    </div>
  );
};

export default AutomationSettings;