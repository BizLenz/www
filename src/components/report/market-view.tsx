"use client";

import React from "react";
import type { MarketAnalysis } from "@/types/analysis-detail-result";
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

interface MarketAnalysisViewProps {
  data: MarketAnalysis;
}

const MarketAnalysisView: React.FC<MarketAnalysisViewProps> = ({ data }) => {
  return (
    <div className="bg-background text-foreground min-h-screen p-4 font-sans sm:p-6 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {data.title}
          </h1>
        </header>

        <main className="space-y-8">
          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle>대상 고객</CardTitle>
              <CardDescription>
                이 프로젝트/사업이 초점을 맞추는 주요 고객층입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{data.target_audience}</p>
            </CardContent>
          </Card>

          {/* Market Size */}
          <Card>
            <CardHeader>
              <CardTitle>시장 규모</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  TAM (Total Addressable Market)
                </p>
                <p className="text-2xl font-bold">{data.market_size.tam}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  SAM (Serviceable Available Market)
                </p>
                <p className="text-2xl font-bold">{data.market_size.sam}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  SOM (Serviceable Obtainable Market)
                </p>
                <p className="text-2xl font-bold">{data.market_size.som}</p>
              </div>
            </CardContent>
          </Card>

          {/* Competitor Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>경쟁사 분석</CardTitle>
              <CardDescription>
                주요 경쟁사와 그들의 강점 및 약점을 파악합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">경쟁사</TableHead>
                    <TableHead>강점</TableHead>
                    <TableHead>약점</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.competitor_analysis.map((competitor, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-semibold">
                        {competitor.competitor}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {competitor.strengths.map((strength, sIdx) => (
                            <Badge
                              key={sIdx}
                              variant="outline"
                              className="border-green-200 bg-green-50 text-green-700"
                            >
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {competitor.weaknesses.map((weakness, wIdx) => (
                            <Badge
                              key={wIdx}
                              variant="destructive"
                              className="border-red-200 bg-red-50 text-red-200"
                            >
                              {weakness}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Market Trends */}
          <Card>
            <CardHeader>
              <CardTitle>시장 트렌드</CardTitle>
              <CardDescription>
                현재 시장을 형성하고 있는 주요 트렌드를 살펴봅니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.market_trends.map((trend, index) => (
                  <Badge key={index} variant="secondary">
                    {trend}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default MarketAnalysisView;
