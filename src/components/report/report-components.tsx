"use client";

import * as React from "react";
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
import { ThumbsUp, ThumbsDown, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

// Import UI components from your project structure
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

// --- TYPE DEFINITIONS ---
// Defining the shape of the data our components expect
type EvaluationCriterion = {
  category: string;
  score: number;
  max_score: number;
  min_score_required: number;
  is_passed: boolean;
  sub_criteria: Array<{ name: string; score: number }>;
  reasoning: string;
};

// --- EXPORTED COMPONENTS ---

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
              // Using direct, contrasting colors for the tooltip for immediate readability
              contentStyle={{
                backgroundColor: "#FFFFFF", // White background
                borderColor: "#E0E0E0", // Light grey border
                color: "#333333", // Dark grey text for content
              }}
              labelStyle={{
                color: "#333333", // Dark grey text for label
              }}
              itemStyle={{
                color: "#333333", // Dark grey text for individual items
              }}
            />
            <Legend wrapperStyle={{ fontSize: "14px" }} />
            <Bar
              dataKey="score"
              // Custom color for '획득 점수' (Acquired Score) - a distinct blue
              fill="#8884d8" // A pleasant, commonly used chart blue/purple
              name="획득 점수"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="max_score"
              // Custom color for '만점' (Max Score) - a lighter grey for contrast
              fill="#BBBBBB" // A light grey
              name="만점"
              radius={[4, 4, 0, 0]}
            />
            {data.map((entry, index) => (
              <ReferenceLine
                key={`ref-${index}`}
                y={entry.min_score_required}
                stroke="hsl(var(--destructive))" // Keeping this as it refers to a specific UI state (destructive)
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

export const FeedbackCard = ({
  title,
  items,
  icon: Icon,
  variant,
}: {
  title: string;
  items: string[];
  icon: React.ElementType;
  variant: "success" | "destructive" | "default";
}) => {
  const colors = {
    success: "text-green-500",
    destructive: "text-red-500",
    default: "text-blue-500",
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className={cn("mr-2 h-5 w-5", colors[variant])} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-start text-sm">
              <span
                className={cn(
                  "mt-1 mr-2 h-1.5 w-1.5 shrink-0 rounded-full",
                  colors[variant],
                  "bg-current",
                )}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const CustomProgressBar = ({
  value,
  max,
  minRequired,
  isPassed,
}: {
  value: number;
  max: number;
  minRequired: number;
  isPassed: boolean;
}) => {
  const percentage = (value / max) * 100;
  const minPercentage = (minRequired / max) * 100;

  return (
    <div className="bg-muted relative h-4 w-full rounded-full">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          isPassed ? "bg-green-500" : "bg-destructive",
        )}
        style={{ width: `${percentage}%` }}
      />
      <div
        className="bg-foreground/50 absolute top-0 h-full w-0.5"
        style={{ left: `${minPercentage}%` }}
        title={`최소 통과 기준: ${minRequired}점`}
      >
        <div className="absolute -top-1.5 -translate-x-1/2 transform">
          <div className="border-foreground/50 bg-background h-2 w-2 rotate-45 transform border-r border-b"></div>
        </div>
      </div>
    </div>
  );
};

export const EvaluationCriteriaCard = ({
  criterion,
}: {
  criterion: EvaluationCriterion;
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>{criterion.category}</CardTitle>
        <Badge variant={criterion.is_passed ? "default" : "destructive"}>
          {criterion.is_passed ? "통과" : "과락"}
        </Badge>
      </div>
      <div className="flex items-baseline pt-2">
        <span className="text-2xl font-bold">{criterion.score.toFixed(1)}</span>
        <span className="text-muted-foreground text-sm">
          / {criterion.max_score}점
        </span>
      </div>
      <CustomProgressBar
        value={criterion.score}
        max={criterion.max_score}
        minRequired={criterion.min_score_required}
        isPassed={criterion.is_passed}
      />
    </CardHeader>
    <CardContent>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={`item-${criterion.category}`}>
          <AccordionTrigger>세부 평가 및 의견 보기</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {criterion.reasoning}
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>세부 항목</TableHead>
                    <TableHead className="text-right">점수</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criterion.sub_criteria.map((sub) => (
                    <TableRow key={sub.name}>
                      <TableCell>{sub.name}</TableCell>
                      <TableCell className="text-right font-mono">
                        {sub.score.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  </Card>
);
