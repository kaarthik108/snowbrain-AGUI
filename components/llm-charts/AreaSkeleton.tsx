"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@tremor/react";
import React from "react";
import { SystemMessage } from ".";

export default function AreaSkeleton() {
  return (
    <>
      <SystemMessage>
        <Card>
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-80" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-1/5" />
            </div>
          </div>
        </Card>
      </SystemMessage>
    </>
  );
}
