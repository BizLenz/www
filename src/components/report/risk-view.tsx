"use client";

import React from "react";
import type { RiskAnalysis } from "@/types/analysis-detail-result";
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

interface RiskAnalysisViewProps {
  data: RiskAnalysis;
}

const RiskAnalysisView: React.FC<RiskAnalysisViewProps> = ({ data }) => {
  // Helper function to get color for likelihood/impact
  const getSeverityClass = (level: string) => {
    switch (level) {
      case "낮음":
        return "text-green-600 font-medium";
      case "중간":
        return "text-yellow-600 font-medium";
      case "높음":
        return "text-red-600 font-semibold";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen p-4 font-sans sm:p-6 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {data.title}
          </h1>
          <p className="text-muted-foreground text-lg">
            이 문서는 {data.title}에 대한 주요 리스크 및 대응 전략 분석
            결과입니다.
          </p>
        </header>

        <main className="space-y-8">
          {/* Risk Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>리스크 매트릭스</CardTitle>
              <CardDescription>
                잠재적 리스크, 발생 가능성, 영향도 및 완화 전략
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.risk_matrix.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30%]">리스크</TableHead>
                      <TableHead className="w-[15%] text-center">
                        발생 가능성
                      </TableHead>
                      <TableHead className="w-[15%] text-center">
                        영향도
                      </TableHead>
                      <TableHead className="w-[40%]">완화 전략</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.risk_matrix.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-semibold">
                          {item.risk}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-center",
                            getSeverityClass(item.likelihood),
                          )}
                        >
                          {item.likelihood}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-center",
                            getSeverityClass(item.impact),
                          )}
                        >
                          {item.impact}
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-pre-wrap">
                          {item.mitigation_strategy}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">
                  리스크 분석 데이터가 없습니다.
                </p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default RiskAnalysisView;
