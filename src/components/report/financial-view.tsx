"use client";

import React from "react";
import type { FinancialAnalysis } from "@/types/analysis-detail-result";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface FinancialAnalysisViewProps {
    data: FinancialAnalysis;
}

const FinancialAnalysisView: React.FC<FinancialAnalysisViewProps> = ({
                                                                         data,
                                                                     }) => {
    return (
        <div className="bg-background text-foreground min-h-screen p-4 font-sans sm:p-6 md:p-8">
            <div className="mx-auto max-w-5xl space-y-8">
                <header className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                        {data.title}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        이 문서는 {data.title}에 대한 재무 분석 결과입니다.
                    </p>
                </header>

                <main className="space-y-8">
                    {/* Revenue Projections */}
                    <Card>
                        <CardHeader>
                            <CardTitle>수익 예측</CardTitle>
                            <CardDescription>향후 예상되는 매출 및 관련 가설</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.revenue_projections.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">연도</TableHead>
                                            <TableHead>예상 수익</TableHead>
                                            <TableHead>가설</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.revenue_projections.map((projection, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-semibold">
                                                    {projection.year}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {projection.revenue}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {projection.assumptions}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-muted-foreground">
                                    수익 예측 데이터가 없습니다.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Cost Analysis */}
                    <Card>
                        <CardHeader>
                            <CardTitle>비용 분석</CardTitle>
                            <CardDescription>사업 운영에 필요한 주요 비용 요소</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm font-medium">
                                    초기 투자 비용
                                </p>
                                <p className="text-xl font-bold">{data.cost_analysis.initial_investment}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm font-medium">
                                    월 고정 비용
                                </p>
                                <p className="text-xl font-bold">{data.cost_analysis.monthly_fixed_cost}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm font-medium">
                                    사용 당 변동 비용
                                </p>
                                <p className="text-xl font-bold">{data.cost_analysis.variable_cost_per_use}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Break-Even Point */}
                    <Card>
                        <CardHeader>
                            <CardTitle>손익분기점</CardTitle>
                            <CardDescription>
                                수익과 비용이 같아지는 지점 (초과 시 이익 발생)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-bold">
                                {data.break_even_point}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Funding Recommendation */}
                    <Card>
                        <CardHeader>
                            <CardTitle>자금 조달 권고</CardTitle>
                            <CardDescription>
                                성공적인 사업 운영을 위한 자금 조달에 대한 권장 사항
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg  whitespace-pre-wrap">
                                {data.funding_recommendation}
                            </p>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default FinancialAnalysisView;