import { format } from "date-fns";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  status: "completed" | "pending" | "rejected" | "in-progress";
}

interface ActivityTimelineProps {
  items: TimelineItem[];
}

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-400",
  },
  pending: {
    icon: Clock,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-400",
  },
  rejected: {
    icon: XCircle,
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-400",
  },
  "in-progress": {
    icon: AlertCircle,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-400",
  },
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  items,
}) => {
  return (
    <div className="space-y-6">
      {items.map((item, index) => {
        const config = statusConfig[item.status];
        const Icon = config.icon;
        const isLast = index === items.length - 1;

        return (
          <div key={item.id} className="relative flex gap-4 group">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-[15px] top-[40px] bottom-[-24px] w-0.5 bg-white/20 group-hover:bg-purple-400/40 transition-colors" />
            )}

            {/* Icon */}
            <div
              className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full ${config.bgColor} ${config.color} flex items-center justify-center border-2 ${config.borderColor} group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-4 h-4" />
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-4 hover:border-white/40 hover:shadow-lg transition-all duration-300 group-hover:translate-x-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <span className="text-xs text-white/60">
                    {format(item.timestamp, "MMM dd, HH:mm")}
                  </span>
                </div>
                <p className="text-sm text-white/80">{item.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
