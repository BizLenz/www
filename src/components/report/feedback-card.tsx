"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  feedbackVariantColors,
  type FeedbackVariant,
} from "@/components/report/report-colors";

export const FeedbackCard = ({
  title,
  items,
  icon: Icon,
  variant,
}: {
  title: string;
  items: string[];
  icon: React.ElementType;
  variant: FeedbackVariant;
}) => {
  const color = feedbackVariantColors[variant];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className={cn("mr-2 h-5 w-5", color)} />
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
                  color,
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
