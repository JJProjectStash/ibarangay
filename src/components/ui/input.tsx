import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  helperText?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
            "hover:border-primary/50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? "input-error" : helperText ? "input-helper" : undefined
          }
          {...props}
        />
        {error && (
          <p
            id="input-error"
            className="mt-1.5 text-sm text-destructive animate-in"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id="input-helper" className="mt-1.5 text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
