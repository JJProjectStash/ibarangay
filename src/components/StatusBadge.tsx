import React from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
}) => {
  const getStatusConfig = () => {
    const configs: Record<
      string,
      { icon: React.ReactNode; className: string; label: string }
    > = {
      // Service statuses
      pending: {
        icon: <Clock className="h-3.5 w-3.5" />,
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
        label: "Pending",
      },
      approved: {
        icon: <CheckCircle className="h-3.5 w-3.5" />,
        className: "bg-green-50 text-green-700 border-green-200",
        label: "Approved",
      },
      borrowed: {
        icon: <Package className="h-3.5 w-3.5" />,
        className: "bg-blue-50 text-blue-700 border-blue-200",
        label: "Borrowed",
      },
      returned: {
        icon: <CheckCircle className="h-3.5 w-3.5" />,
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Returned",
      },
      rejected: {
        icon: <XCircle className="h-3.5 w-3.5" />,
        className: "bg-red-50 text-red-700 border-red-200",
        label: "Rejected",
      },
      // Complaint statuses
      "in-progress": {
        icon: <AlertCircle className="h-3.5 w-3.5" />,
        className: "bg-blue-50 text-blue-700 border-blue-200",
        label: "In Progress",
      },
      resolved: {
        icon: <CheckCircle className="h-3.5 w-3.5" />,
        className: "bg-green-50 text-green-700 border-green-200",
        label: "Resolved",
      },
      closed: {
        icon: <XCircle className="h-3.5 w-3.5" />,
        className: "bg-gray-50 text-gray-700 border-gray-200",
        label: "Closed",
      },
      // Event statuses
      upcoming: {
        icon: <Calendar className="h-3.5 w-3.5" />,
        className: "bg-blue-50 text-blue-700 border-blue-200",
        label: "Upcoming",
      },
      ongoing: {
        icon: <AlertCircle className="h-3.5 w-3.5" />,
        className: "bg-orange-50 text-orange-700 border-orange-200",
        label: "Ongoing",
      },
      completed: {
        icon: <CheckCircle className="h-3.5 w-3.5" />,
        className: "bg-green-50 text-green-700 border-green-200",
        label: "Completed",
      },
      cancelled: {
        icon: <XCircle className="h-3.5 w-3.5" />,
        className: "bg-red-50 text-red-700 border-red-200",
        label: "Cancelled",
      },
    };

    return (
      configs[status.toLowerCase()] || {
        icon: <AlertCircle className="h-3.5 w-3.5" />,
        className: "bg-gray-50 text-gray-700 border-gray-200",
        label: status,
      }
    );
  };

  const config = getStatusConfig();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
        config.className,
        className
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: "low" | "medium" | "high";
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className,
}) => {
  const configs = {
    low: {
      className: "bg-blue-50 text-blue-700 border-blue-200",
      label: "Low",
    },
    medium: {
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      label: "Medium",
    },
    high: {
      className: "bg-red-50 text-red-700 border-red-200",
      label: "High",
    },
  };

  const config = configs[priority];

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};
