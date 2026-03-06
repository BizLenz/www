import { Progress } from "@/components/ui/progress";

const STORAGE_LIMIT_MIB = 1024;

export function StorageUsageBar({ usedMiB }: { usedMiB: number }) {
  if (!usedMiB) return null;
  return (
    <div className="flex flex-1 flex-row items-center justify-end gap-4">
      <p className="text-muted-foreground text-sm">사용중인 저장공간</p>
      <small className="text-sm leading-none font-medium">
        {usedMiB}MiB/1GiB
      </small>
      <Progress
        value={(usedMiB / STORAGE_LIMIT_MIB) * 100}
        className="w-[20%]"
      />
    </div>
  );
}
