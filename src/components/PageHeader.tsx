import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  action,
  actions,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8",
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        </div>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {(actions || action) && (
        <div className="flex items-center gap-2">{actions || action}</div>
      )}
    </div>
  );
};

export default PageHeader;
