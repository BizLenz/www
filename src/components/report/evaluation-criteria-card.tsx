"use client";

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
import { CustomProgressBar } from "@/components/report/custom-progress-bar";
import type { EvaluationCriterion } from "@/components/report/report-colors";

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
