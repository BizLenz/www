"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EvaluationCriterion } from "@/components/report/report-colors";

export const ScoreChart = ({ data }: { data: EvaluationCriterion[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>항목별 점수 분포</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E0E0E0",
                color: "#333333",
              }}
              labelStyle={{
                color: "#333333",
              }}
              itemStyle={{
                color: "#333333",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "14px" }} />
            <Bar
              dataKey="score"
              fill="#8884d8"
              name="획득 점수"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="max_score"
              fill="#BBBBBB"
              name="만점"
              radius={[4, 4, 0, 0]}
            />
            {data.map((entry, index) => (
              <ReferenceLine
                key={`ref-${index}`}
                y={entry.min_score_required}
                stroke="hsl(var(--destructive))"
                strokeDasharray="3 3"
                ifOverflow="extendDomain"
              />
            ))}
            <ReferenceLine y={0} stroke="#ccc" />
          </BarChart>
        </ResponsiveContainer>
        <div className="text-muted-foreground mt-2 flex items-center justify-center text-xs">
          <div className="mr-4 flex items-center">
            <div className="bg-destructive mr-1 h-2 w-2 rounded-full" />
            <span>최소 통과 기준 점수</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
