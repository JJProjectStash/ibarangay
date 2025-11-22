import React from "react";
import { Badge } from "./ui/badge";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "outline";
  showIcon?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = "default",
  showIcon = true,
}) => {
  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();

    const configs: Record<
      string,
      { label: string; className: string; icon: React.ReactNode }
    > = {
      pending: {
        label: "Pending",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
        icon: <Clock className="h-3 w-3" />,
      },
      approved: {
        label: "Approved",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      rejected: {
        label: "Rejected",
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
        icon: <XCircle className="h-3 w-3" />,
      },
      borrowed: {
        label: "Borrowed",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        icon: <AlertCircle className="h-3 w-3" />,
      },
      returned: {
        label: "Returned",
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      "in-progress": {
        label: "In Progress",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        icon: <Clock className="h-3 w-3" />,
      },
      resolved: {
        label: "Resolved",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      closed: {
        label: "Closed",
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
        icon: <XCircle className="h-3 w-3" />,
      },
      upcoming: {
        label: "Upcoming",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        icon: <Clock className="h-3 w-3" />,
      },
      ongoing: {
        label: "Ongoing",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
        icon: <AlertCircle className="h-3 w-3" />,
      },
      completed: {
        label: "Completed",
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      cancelled: {
        label: "Cancelled",
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
        icon: <XCircle className="h-3 w-3" />,
      },
    };

    return (
      configs[statusLower] || {
        label: status,
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
        icon: <AlertCircle className="h-3 w-3" />,
      }
    );
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={variant} className={config.className}>
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
