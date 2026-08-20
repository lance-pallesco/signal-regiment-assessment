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
  setMonth,
  setYear,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
  fromYear?: number;
  toYear?: number;
}

export function Calendar({
  selected,
  onSelect,
  className,
  fromYear = 1920,
  toYear = new Date().getFullYear() + 5,
}: CalendarProps) {
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

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const monthIndex = parseInt(e.target.value, 10);
    setCurrentMonth(setMonth(currentMonth, monthIndex));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value, 10);
    setCurrentMonth(setYear(currentMonth, year));
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = React.useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [startDate, endDate]);

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = React.useMemo(() => {
    const arr: number[] = [];
    for (let y = toYear; y >= fromYear; y--) {
      arr.push(y);
    }
    return arr;
  }, [fromYear, toYear]);

  return (
    <div className={cn("p-3 w-[290px] bg-popover text-popover-foreground rounded-xl border border-border shadow-xl", className)}>
      {/* Header with Month & Year dropdowns + Chevrons */}
      <div className="flex items-center justify-between pb-2.5 px-0.5 border-b border-border/50 gap-1">
        <div className="flex items-center gap-1.5">
          <select
            value={currentMonth.getMonth()}
            onChange={handleMonthChange}
            className="h-7 text-xs font-bold rounded-md bg-muted/60 hover:bg-muted border border-border/70 px-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
          >
            {months.map((m, idx) => (
              <option key={m} value={idx}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={currentMonth.getFullYear()}
            onChange={handleYearChange}
            className="h-7 text-xs font-bold rounded-md bg-muted/60 hover:bg-muted border border-border/70 px-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 pt-2.5 pb-1 text-center">
        {weekDays.map((day) => (
          <span
            key={day}
            className="text-[0.7rem] font-semibold text-muted-foreground uppercase"
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
                "h-8 w-8 mx-auto flex items-center justify-center rounded-lg text-xs font-medium transition-all cursor-pointer",
                !isCurrentMonth && "text-muted-foreground/20 pointer-events-none",
                isCurrentMonth &&
                  !isSelectedDay &&
                  !isTodayDay &&
                  "text-foreground hover:bg-emerald-100/60 dark:hover:bg-emerald-950/60 hover:text-emerald-900 dark:hover:text-emerald-200",
                isTodayDay &&
                  !isSelectedDay &&
                  "border border-emerald-600/50 text-emerald-700 dark:text-emerald-400 font-bold",
                isSelectedDay &&
                  "bg-emerald-800 text-white font-bold shadow-xs hover:bg-emerald-900"
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
