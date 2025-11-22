import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 animate-in slide-in-from-top-4 duration-500",
        className
      )}
    >
      <div className="flex items-center gap-4">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text-primary">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

export default PageHeader;
