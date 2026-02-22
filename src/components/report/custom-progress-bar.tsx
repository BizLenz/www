"use client";

import { cn } from "@/lib/utils";

export const CustomProgressBar = ({
  value,
  max,
  minRequired,
  isPassed,
}: {
  value: number;
  max: number;
  minRequired: number;
  isPassed: boolean;
}) => {
  const percentage = (value / max) * 100;
  const minPercentage = (minRequired / max) * 100;

  return (
    <div className="bg-muted relative h-4 w-full rounded-full">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          isPassed ? "bg-green-500" : "bg-destructive",
        )}
        style={{ width: `${percentage}%` }}
      />
      <div
        className="bg-foreground/50 absolute top-0 h-full w-0.5"
        style={{ left: `${minPercentage}%` }}
        title={`최소 통과 기준: ${minRequired}점`}
      >
        <div className="absolute -top-1.5 -translate-x-1/2 transform">
          <div className="border-foreground/50 bg-background h-2 w-2 rotate-45 transform border-r border-b"></div>
        </div>
      </div>
    </div>
  );
};
