import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="text-center py-5">
      {Icon && (
        <div className="mb-3">
          <Icon size={48} className="text-muted" />
        </div>
      )}
      <h5 className="text-muted mb-2">{title}</h5>
      {description && <p className="text-muted small mb-3">{description}</p>}
      {action && (
        <button className="btn btn-primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
