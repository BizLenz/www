import { useAnalyzeStore, type FileSettings } from "@/store/analyze-store";

interface Step2ReviewProps {
    fileId: string;
}

const EMPTY_SETTINGS: FileSettings = {};
const FIXED_SCOPE = "기본분석";

export function Step2Review({ fileId }: Step2ReviewProps) {
    const settings = useAnalyzeStore(
        (s) => s.files[fileId] ?? EMPTY_SETTINGS
    );

    const allScopes = [FIXED_SCOPE, ...(settings.analysisScope ?? [])];

    return (
        <div>
            <h4 className="font-semibold mb-2">최종 확인</h4>
            <p>평가 양식: {settings.program ?? "선택 안 함"}</p>
            <p>
                분석 범위:{" "}
                {allScopes.length ? allScopes.join(", ") : "선택 안 함"}
            </p>
        </div>
    );
}