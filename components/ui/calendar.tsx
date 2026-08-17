"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    selected || new Date()
  );

  React.useEffect(() => {
    if (selected) {
      setCurrentMonth(selected);
    }
  }, [selected]);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = React.useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [startDate, endDate]);

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className={cn("p-3 w-[280px] bg-popover text-popover-foreground rounded-xl border border-border shadow-lg", className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 px-1 border-b border-border/50">
        <span className="text-sm font-semibold text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 pt-3 pb-1 text-center">
        {weekDays.map((day) => (
          <span
            key={day}
            className="text-[0.75rem] font-medium text-muted-foreground uppercase"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelectedDay = selected ? isSameDay(day, selected) : false;
          const isTodayDay = isToday(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => {
                if (onSelect) onSelect(day);
              }}
              disabled={!isCurrentMonth}
              className={cn(
                "h-8 w-8 mx-auto flex items-center justify-center rounded-md text-xs font-medium transition-colors cursor-pointer",
                !isCurrentMonth && "text-muted-foreground/30 pointer-events-none",
                isCurrentMonth &&
                  !isSelectedDay &&
                  !isTodayDay &&
                  "text-foreground hover:bg-accent hover:text-accent-foreground",
                isTodayDay &&
                  !isSelectedDay &&
                  "border border-primary text-primary font-bold",
                isSelectedDay &&
                  "bg-primary text-primary-foreground font-bold shadow-xs hover:bg-primary/90"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
