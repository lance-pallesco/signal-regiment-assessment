"use client";

import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: string;
  onDateChange: (dateString: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  hasError?: boolean;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  id,
  className,
  hasError,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selectedDate = React.useMemo(() => {
    if (!date) return undefined;
    const parsed = parseISO(date);
    return isValid(parsed) ? parsed : undefined;
  }, [date]);

  const handleSelect = (day: Date) => {
    if (day) {
      const dateString = format(day, "yyyy-MM-dd");
      onDateChange(dateString);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-9 bg-background shadow-xs",
            !date && "text-muted-foreground",
            hasError && "border-destructive focus-visible:ring-destructive",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          {selectedDate ? (
            format(selectedDate, "MMM d, yyyy")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none shadow-none bg-transparent" align="start">
        <Calendar
          selected={selectedDate}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
