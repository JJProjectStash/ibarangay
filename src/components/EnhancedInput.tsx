import React, { InputHTMLAttributes, TextareaHTMLAttributes, useEffect, useMemo, useState, useId } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";

type BaseProps = {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  id?: string;
  className?: string;
};

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & {
  component?: "input";
};

type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & {
  component: "textarea";
};

export type EnhancedInputProps = InputProps | TextareaProps;

const isTextarea = (props: EnhancedInputProps): props is TextareaProps => {
  return (props as TextareaProps).component === "textarea";
};

const EnhancedInput: React.FC<EnhancedInputProps & { onDebounceChange?: (value: string) => void; debounceMs?: number; }> = (props) => {
  const {
    label,
    helperText,
    error,
    success,
    icon,
    id,
    className,
    debounceMs = 500,
    onDebounceChange,
    ...rest
  } = props as InputProps & { onDebounceChange?: (value: string) => void; debounceMs?: number };

  const [value, setValue] = useState<string>(
    (rest as InputHTMLAttributes<HTMLInputElement>).value as string || ""
  );

  // Update state when parent value changes
  useEffect(() => {
    if ((rest as InputHTMLAttributes<HTMLInputElement>).value !== undefined) {
      setValue((rest as InputHTMLAttributes<HTMLInputElement>).value as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(rest as InputHTMLAttributes<HTMLInputElement>).value]);

  const debouncedValue = useDebounce(value, debounceMs);

  useEffect(() => {
    if (onDebounceChange) onDebounceChange(debouncedValue);
  }, [debouncedValue, onDebounceChange]);

  // Generate a stable ID if not provided to ensure label - input association
  const generatedId = useId();
  const inputId = id || `enhanced-input-${generatedId}`;

  const describedByIds: string[] = [];
  if (helperText) describedByIds.push(`${inputId}-helper`);
  if (error) describedByIds.push(`${inputId}-error`);

  const sharedProps = useMemo(() => ({
    id: inputId,
    className: `input ${className || ""} ${error ? "input-error" : ""} ${success ? "input-success" : ""}`,
    'aria-describedby': describedByIds.length ? describedByIds.join(' ') : undefined,
    'aria-invalid': !!error,
    ...rest,
  }), [inputId, className, error, success, rest, describedByIds.length]);

  return (
    <div className={`form-group ${className || ""}`}>
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {isTextarea(props) ? (
          <textarea
            {...(sharedProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              // also call external onChange if provided
              (rest as any).onChange?.(e as any);
            }}
          />
        ) : (
          <input
            {...(sharedProps as InputHTMLAttributes<HTMLInputElement>)}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              (rest as any).onChange?.(e as any);
            }}
          />
        )}
        {icon && (
          <span aria-hidden={true} focusable={false} style={{ position: "absolute", right: "0.6rem", top: "50%", transform: "translateY(-50%)" }}>
            {icon}
          </span>
        )}
      </div>
      {helperText && !error && (
        <p className="form-helper" id={`${inputId}-helper`}>{helperText}</p>
      )}
      {error && (
        <p className="form-error" id={`${inputId}-error`}><AlertCircle size={14} /> {error}</p>
      )}
      {success && !error && (
        <p className="form-helper" style={{ color: "var(--success)" }}><CheckCircle size={14} /> Saved</p>
      )}
    </div>
  );
};

export default EnhancedInput;
