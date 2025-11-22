import React from "react";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
  description?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  children,
  className,
  required,
  description,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className={cn(error && "text-destructive")}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {children}
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-destructive animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};
