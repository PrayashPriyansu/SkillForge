import { cn } from '@/lib/utils';

type ProgressBarProps = {
  progress: number;
  length?: number;
};

function ProgressBar({ progress, length = 30 }: ProgressBarProps) {
  // Ensure progress is clamped between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  // Calculate how many bars should be active out of 30
  const activeBars = (clampedProgress / 100) * length;

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center gap-0.5" // Reduced gap for a tighter look with more bars
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {Array.from({ length: length }).map((_, index) => (
          <Bar key={index} isActive={activeBars > index} />
        ))}
      </div>
      <div className="font-sans text-sm font-semibold">{progress}%</div>
    </div>
  );
}

export default ProgressBar;

// --- Sub-component --- //

type BarProps = {
  isActive: boolean;
};

function Bar({ isActive }: BarProps) {
  return (
    <div
      className={cn(
        'h-5 w-1.5 rounded-sm', // Made the bars slightly thinner
        isActive ? 'bg-primary' : 'bg-muted-foreground/50' // Muted the inactive bars further
      )}
    />
  );
}
