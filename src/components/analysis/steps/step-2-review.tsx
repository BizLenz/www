import { type FileSettings, useAnalyzeStore } from "@/store/analysis-store";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ChartNoAxesGantt, FileBadge } from "lucide-react";

interface Step2ReviewProps {
  fileId: number;
}

const EMPTY_SETTINGS: FileSettings = {};
const FIXED_SCOPE = "기본분석";

export function Step2Review({ fileId }: Step2ReviewProps) {
  const settings = useAnalyzeStore((s) => s.files[fileId] ?? EMPTY_SETTINGS);

  const allScopes = [FIXED_SCOPE, ...(settings.analysisScope ?? [])];

  return (
    <div className="flex flex-col gap-4">
      <h4 className="mb-2 font-semibold">최종 확인</h4>
      <Item variant="outline" size="sm">
        <ItemMedia>
          <FileBadge className="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>평가 양식</ItemTitle>
          <div className="text-muted-foreground">
            {settings.contestType ?? "선택 안 함"}
          </div>
        </ItemContent>
      </Item>
      <Item variant="outline" size="sm">
        <ItemMedia>
          <ChartNoAxesGantt className="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>분석 범위</ItemTitle>
          <div className="text-muted-foreground">
            {allScopes.length ? allScopes.join(", ") : "선택 안 함"}
          </div>
        </ItemContent>
      </Item>
    </div>
  );
}
