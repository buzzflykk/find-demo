interface Props {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function StepIndicator({ currentStep, totalSteps, labels }: Props) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isDone = stepNum < currentStep;

          return (
            <div key={stepNum} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    isDone
                      ? 'bg-[var(--color-primary)] text-white'
                      : isActive
                        ? 'border-2 border-[var(--color-primary)] text-[var(--color-primary)]'
                        : 'border-2 border-[var(--color-border)] text-[var(--color-text-muted)]'
                  }`}
                >
                  {isDone ? '✓' : stepNum}
                </div>
                <span
                  className={`mt-1 text-xs ${
                    isActive
                      ? 'font-medium text-[var(--color-primary)]'
                      : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {labels[i]}
                </span>
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`mx-2 mt-[-1.5rem] h-px flex-1 ${
                    isDone ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
