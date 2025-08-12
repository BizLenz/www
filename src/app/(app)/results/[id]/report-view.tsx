"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { type AnalysisResult } from "@/types/analysis-result";

export default function ReportView({ result }: { result: AnalysisResult }) {
    const scoreData =
        result.evaluations?.map((e) => ({
            name: e.evaluationType,
            score: e.score,
        })) ?? [];

    return (
        <div className="flex flex-1 flex-col gap-6 p-10">
            <h1 className="text-4xl font-bold">분석 보고서</h1>

            {/* 파일 정보 */}
            <Card>
                <CardHeader>
                    <CardTitle>파일 정보</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        <strong>파일 ID:</strong> {result.id}
                    </p>
                    <p>
                        <strong>파일 이름:</strong> {result.fileName}
                    </p>
                    <p>
                        <strong>생성일:</strong>{" "}
                        {new Date(result.createdAt).toLocaleString()}
                    </p>
                    <p>
                        <strong>업데이트일:</strong>{" "}
                        {new Date(result.updatedAt).toLocaleString()}
                    </p>
                </CardContent>
            </Card>

            {/* 점수 분포 그래프 */}
            <Card>
                <CardHeader>
                    <CardTitle>평가 점수 분포</CardTitle>
                </CardHeader>
                <CardContent style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scoreData}>
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="score" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 상세 평가 */}
            <Card>
                <CardHeader>
                    <CardTitle>상세 평가</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible>
                        {result.evaluations?.map((e, idx) => (
                            <AccordionItem key={idx} value={`item-${idx}`}>
                                <AccordionTrigger>
                                    {e.title} ({e.grade})
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p>
                                        <strong>요약:</strong> {e.summary}
                                    </p>
                                    <p>
                                        <strong>상세 피드백:</strong> {e.detailedFeedback}
                                    </p>
                                    <p>
                                        <strong>강점:</strong> {e.strengths?.join(", ")}
                                    </p>
                                    <p>
                                        <strong>약점:</strong> {e.weaknesses?.join(", ")}
                                    </p>
                                    <p>
                                        <strong>추천사항:</strong> {e.recommendations?.join(", ")}
                                    </p>
                                    <p>
                                        <strong>중요도:</strong> {e.importanceLevel}
                                    </p>
                                    <p>
                                        <strong>상태:</strong> {e.status}
                                    </p>
                                    <p>
                                        <strong>신뢰도:</strong> {e.confidenceScore}%
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

            {/* 메트릭 테이블 */}
            <Card>
                <CardHeader>
                    <CardTitle>평가 메트릭</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>평가 유형</TableHead>
                                <TableHead>메트릭</TableHead>
                                <TableHead>벤치마크</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.evaluations?.map((e, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{e.evaluationType}</TableCell>
                                    <TableCell>
                                        {Object.entries(e.metrics ?? {})
                                            .map(([k, v]) => `${k}: ${v}`)
                                            .join(", ")}
                                    </TableCell>
                                    <TableCell>
                                        {Object.entries(e.benchmarkData ?? {})
                                            .map(([k, v]) => `${k}: ${v}`)
                                            .join(", ")}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}