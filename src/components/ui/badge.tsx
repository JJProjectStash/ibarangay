import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-current",

        // Status-specific variants with WCAG AA compliant colors
        pending:
          "border-yellow-400/50 bg-yellow-500/20 text-yellow-200 backdrop-blur-sm",
        approved:
          "border-green-400/50 bg-green-500/20 text-green-200 backdrop-blur-sm",
        rejected:
          "border-red-400/50 bg-red-500/20 text-red-200 backdrop-blur-sm",
        "in-progress":
          "border-blue-400/50 bg-blue-500/20 text-blue-200 backdrop-blur-sm",
        completed:
          "border-gray-400/50 bg-gray-500/20 text-gray-200 backdrop-blur-sm",
        borrowed:
          "border-cyan-400/50 bg-cyan-500/20 text-cyan-200 backdrop-blur-sm",
        returned:
          "border-emerald-400/50 bg-emerald-500/20 text-emerald-200 backdrop-blur-sm",
        ongoing:
          "border-green-400/50 bg-green-500/20 text-green-200 backdrop-blur-sm",
        upcoming:
          "border-blue-400/50 bg-blue-500/20 text-blue-200 backdrop-blur-sm",
        cancelled:
          "border-red-400/50 bg-red-500/20 text-red-200 backdrop-blur-sm",
        closed:
          "border-gray-400/50 bg-gray-500/20 text-gray-200 backdrop-blur-sm",

        success:
          "border-green-400/50 bg-green-500/20 text-green-200 backdrop-blur-sm",
        warning:
          "border-yellow-400/50 bg-yellow-500/20 text-yellow-200 backdrop-blur-sm",
        info: "border-blue-400/50 bg-blue-500/20 text-blue-200 backdrop-blur-sm",
        error: "border-red-400/50 bg-red-500/20 text-red-200 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const badgeIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
  "in-progress": TrendingUp,
  completed: CheckCircle,
  borrowed: AlertCircle,
  returned: CheckCircle,
  ongoing: AlertCircle,
  upcoming: Clock,
  cancelled: XCircle,
  closed: XCircle,
  success: CheckCircle,
  warning: AlertCircle,
  info: AlertCircle,
  error: XCircle,
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  showIcon?: boolean;
}

function Badge({
  className,
  variant,
  showIcon = false,
  children,
  ...props
}: BadgeProps) {
  const Icon = variant && badgeIcons[variant as keyof typeof badgeIcons];

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {showIcon && Icon && <Icon className="h-3 w-3 mr-1" />}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
