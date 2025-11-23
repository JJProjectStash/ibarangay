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
        <Label className={cn("text-white/90", error && "text-red-300")}>
          {label}
          {required && <span className="text-red-300 ml-1">*</span>}
        </Label>
      )}
      {children}
      {description && !error && (
        <p className="text-xs text-white/60">{description}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-300 animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};
