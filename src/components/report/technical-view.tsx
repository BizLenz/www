"use client";

import React from "react";
import type { TechnicalAnalysis } from "@/types/analysis-detail-result";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


interface TechnicalAnalysisViewProps {
  data: TechnicalAnalysis;
}

const TechnicalAnalysisView: React.FC<TechnicalAnalysisViewProps> = ({
  data,
}) => {
  const { frontend, backend, infra, evaluation } =
    data.technology_stack_assessment;

  const techStackTableData = [
    { category: "프론트엔드", technologies: frontend },
    { category: "백엔드", technologies: backend },
    { category: "인프라", technologies: infra },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen p-4 font-sans sm:p-6 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {data.title}
          </h1>
          <p className="text-muted-foreground text-lg">
            이 문서는 {data.title}에 대한 기술 스택 및 시스템 분석 결과입니다.
          </p>
        </header>

        <main className="space-y-8">
          {/* Technology Stack Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>기술 스택 평가</CardTitle>
              <CardDescription>
                시스템 구성 기술 및 전반적인 평가
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {" "}
              {/* Increased spacing */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">범주</TableHead>
                    <TableHead>기술 스택</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {techStackTableData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-semibold">
                        {item.category}
                      </TableCell>
                      <TableCell>
                        <p className="text-base">{item.technologies}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* Overall Evaluation */}
              <div className="space-y-1 border-t border-dashed border-gray-200 pt-4">
                <p className="text-muted-foreground text-sm font-medium">
                  전반적인 기술 스택 평가
                </p>
                <p className="text-base whitespace-pre-wrap">{evaluation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Scalability */}
          <Card>
            <CardHeader>
              <CardTitle>확장성</CardTitle>
              <CardDescription>
                트래픽 및 사용자 증가에 대한 시스템의 대응 능력
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-base whitespace-pre-wrap">
                {data.scalability}
              </p>
            </CardContent>
          </Card>

          {/* Security Risks */}
          <Card>
            <CardHeader>
              <CardTitle>보안 리스크</CardTitle>
              <CardDescription>
                시스템에 존재할 수 있는 잠재적 보안 위협 요소
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.security_risks.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.security_risks.map((risk, index) => (
                    <Badge
                      key={index}
                      variant="destructive"
                      className="border-red-200 bg-red-50 text-red-200"
                    >
                      {risk}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  현재 파악된 주요 보안 리스크가 없습니다.
                </p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default TechnicalAnalysisView;
