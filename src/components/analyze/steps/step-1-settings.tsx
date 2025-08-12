import { useAnalyzeStore, type FileSettings } from "@/store/analyze-store";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgramComboBox } from "@/components/analyze/program-combo-box";
import { useCallback } from "react";

interface Step1SettingsProps {
    fileId: string;
}

const EMPTY_SETTINGS: FileSettings = {};

const FIXED_SCOPE = "기본분석"; // ✅ always included
const ANALYSIS_OPTIONS = [
    "사업성 분석",
    "경쟁력 분석",
    "시장성 분석",
    "고객/사용자 분석",
    "리스크 분석",
];

export function Step1Settings({ fileId }: Step1SettingsProps) {
    const settings = useAnalyzeStore(
        (s) => s.files[fileId] ?? EMPTY_SETTINGS
    );
    const setSettings = useAnalyzeStore((s) => s.setFileSettings);

    const toggleScope = useCallback(
        (scope: string, checked: boolean) => {
            const current = settings.analysisScope || [];
            if (checked) {
                setSettings(fileId, { analysisScope: [...current, scope] });
            } else {
                setSettings(fileId, {
                    analysisScope: current.filter((s) => s !== scope),
                });
            }
        },
        [fileId, settings.analysisScope, setSettings]
    );

    return (
        <div className="space-y-6">
            {/* 평가 양식 선택 */}
            <div className="space-y-2">
                <div className="text-lg font-semibold">평가 양식 선택</div>
                <ProgramComboBox
                    value={settings.program || ""}
                    onChange={(value) => setSettings(fileId, { program: value })}
                />
            </div>

            {/* 분석 범위 설정 */}
            <div className="space-y-2">
                <div className="text-lg font-semibold">분석 범위 설정</div>
                <div className="space-y-1">
                    <div className="flex items-center space-x-2 py-2 opacity-70">
                        <Checkbox id={FIXED_SCOPE} checked={true} disabled />
                        <Label htmlFor={FIXED_SCOPE}>{FIXED_SCOPE} (기본)</Label>
                    </div>

                    {ANALYSIS_OPTIONS.map((option) => (
                        <div
                            key={option}
                            className="flex items-center space-x-2 py-2"
                        >
                            <Checkbox
                                id={option}
                                checked={settings.analysisScope?.includes(option) || false}
                                onCheckedChange={(checked) =>
                                    toggleScope(option, Boolean(checked))
                                }
                            />
                            <Label htmlFor={option}>{option}</Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}