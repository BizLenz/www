import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  count: number;
}

// Dashboard (total analysis count, analysis in progress, uploaded files)
export default function StatCard({ icon, title, count }: StatCardProps) {
  return (
    <div className="flex flex-1 flex-row items-center justify-between gap-4 rounded-xl border-1 p-5">
      <div className="flex items-center gap-5">
        {icon}
        <div className="text-lg font-semibold">{title}</div>
      </div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
        {count}
      </h1>
    </div>
  );
}
