"use client";

import { cn } from "@/lib/utils";
import type { PlanTask } from "@/context/chat-context";
import { CheckCircle2, ChevronDown, Circle, Loader2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

export function PlanLive({ tasks, className }: { tasks: PlanTask[]; className?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const { done, total } = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "completed").length;
    return { done, total };
  }, [tasks]);

  return (
    <div className={cn("rounded-md border bg-card text-card-foreground", className)}>
      <div className="flex items-center justify-between px-3 py-2">
        <div className="text-sm font-medium">{done} of {total} Done</div>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground transition"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand plan" : "Collapse plan"}
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", collapsed ? "-rotate-90" : "rotate-0")} />
        </button>
      </div>
      {!collapsed && (
        <div className="px-3 pb-3">
          <ul className="flex flex-col gap-2">
            {tasks.map((t) => {
              const isDone = t.status === "completed";
              const isRunning = t.status === "running";
              const isFailed = t.status === "failed";
              return (
                <li key={t.id} className="flex items-start gap-2">
                  <span
                    className={cn(
                      "mt-0.5 inline-flex h-4 w-4 items-center justify-center",
                      isFailed ? "text-red-700" : isDone ? "text-green-800" : "text-amber-800"
                    )}
                  >
                    {isFailed ? (
                      <XCircle className="h-4 w-4" />
                    ) : isDone ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : isRunning ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Circle className="mt-1" size="14" />
                    )}
                  </span>
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        isFailed ? "text-red-700" : isDone ? "text-green-800 line-through" : "text-amber-800",
                        isRunning ? "italic" : undefined
                      )}
                    >
                      {t.title}
                    </span>
                    {t.explanation && (
                      <span className="text-xs text-muted-foreground">{t.explanation}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
