import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in duration-700",
        className
      )}
    >
      <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center mb-6 border-2 border-white/20 shadow-lg">
        <Icon className="h-10 w-10 text-white/70" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/80 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:scale-105"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
