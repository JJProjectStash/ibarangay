import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
            "hover:border-primary/50",
            "resize-none",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error
              ? "textarea-error"
              : helperText
              ? "textarea-helper"
              : undefined
          }
          {...props}
        />
        {error && (
          <p
            id="textarea-error"
            className="mt-1.5 text-sm text-destructive animate-in"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id="textarea-helper"
            className="mt-1.5 text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
