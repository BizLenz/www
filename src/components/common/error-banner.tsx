import { cn } from "@/lib/utils";

export function ErrorBanner({
  error,
  onRetry,
  className,
}: {
  error: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700",
        className,
      )}
    >
      <span>{error}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-4 font-medium underline hover:no-underline"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
