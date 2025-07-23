import type { ReactNode } from "react";

interface PostProps {
  icon: ReactNode;
  title: string;
  count: number;
}

export default function Post({ icon, title, count }: PostProps) {
  return (
    <div className="flex flex-1 flex-row items-center justify-between gap-4 rounded-xl border-1 p-5">
      <div className="flex items-center gap-5">
        {icon}
        <div className="text-lg font-semibold">{title}</div>
      </div>
      <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-balance">
        {count}
      </h1>
    </div>
  );
}
