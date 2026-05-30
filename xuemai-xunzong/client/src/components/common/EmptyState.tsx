interface Props {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center px-4 pt-16 text-center">
      {/* 暖色装饰圈 */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-50 to-orange-100 shadow-inner">
        <span className="text-5xl opacity-70">{icon}</span>
      </div>
      <h3 className="mb-2 text-lg font-medium text-[var(--color-text)]">{title}</h3>
      <p className="mb-6 max-w-xs text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
