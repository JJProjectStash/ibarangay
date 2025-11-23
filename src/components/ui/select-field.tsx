import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface SelectFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  error?: string;
  className?: string;
  required?: boolean;
}

export function SelectField({
  label,
  placeholder,
  value,
  onValueChange,
  options,
  disabled,
  error,
  className,
  required,
}: SelectFieldProps) {
  // Filter out options with empty string values to prevent Radix UI errors
  const validOptions = options.filter((option) => option.value !== "");

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-white/90 flex items-center gap-1">
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          className={cn(
            "bg-white/10 backdrop-blur-xl border-white/20 text-white",
            "focus:border-purple-400/50 focus:ring-purple-400/20",
            "hover:border-white/40 transition-all duration-300",
            error && "border-red-400/50 focus:border-red-400/50"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-white/20">
          {validOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-white focus:bg-white/10 focus:text-white cursor-pointer transition-colors duration-200"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-red-300 text-xs flex items-center gap-1 animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );
}
