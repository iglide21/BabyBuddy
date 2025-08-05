"use client";

import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Calendar as CalendarComponent } from "@/src/components/ui/calendar";
import { cn } from "@/src/lib/utils";
import dayjs, { getStartOfDay, getEndOfDay } from "lib/dayjs";
import type { DateRange as CalendarDateRange } from "react-day-picker";
import { DateRange, PredefinedRange } from "@/types/date-range";

const predefinedRanges: PredefinedRange[] = [
  {
    label: "Last 24 hours",
    value: "1day",
    getRange: () => ({
      label: "Last 24 hours",
      value: "1day",
      from: getStartOfDay(dayjs().subtract(1, "day")).toDate(),
      to: getEndOfDay(dayjs()).toDate(),
    }),
  },
  {
    label: "Last 7 days",
    value: "1week",
    getRange: () => ({
      label: "Last 7 days",
      value: "1week",
      from: getStartOfDay(dayjs().subtract(7, "day")).toDate(),
      to: getEndOfDay(dayjs()).toDate(),
    }),
  },
  {
    label: "Last 30 days",
    value: "1month",
    getRange: () => ({
      label: "Last 30 days",
      value: "1month",
      from: getStartOfDay(dayjs().subtract(30, "day")).toDate(),
      to: getEndOfDay(dayjs()).toDate(),
    }),
  },
  {
    label: "Last 3 months",
    value: "3months",
    getRange: () => ({
      label: "Last 3 months",
      value: "3months",
      from: getStartOfDay(dayjs().subtract(3, "month")).toDate(),
      to: getEndOfDay(dayjs()).toDate(),
    }),
  },
  {
    label: "Last 6 months",
    value: "6months",
    getRange: () => ({
      label: "Last 6 months",
      value: "6months",
      from: getStartOfDay(dayjs().subtract(6, "month")).toDate(),
      to: getEndOfDay(dayjs()).toDate(),
    }),
  },
  {
    label: "Last year",
    value: "1year",
    getRange: () => ({
      label: "Last year",
      value: "1year",
      from: getStartOfDay(dayjs().subtract(1, "year")).toDate(),
      to: getEndOfDay(dayjs()).toDate(),
    }),
  },
  {
    label: "Custom",
    value: "custom",
    getRange: () => ({
      label: "Custom",
      value: "custom",
      from: getStartOfDay(dayjs().subtract(1, "day")).toDate(),
      to: getEndOfDay(dayjs()).toDate(),
    }),
  },
];

export interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  disabled?: boolean;
}

export const DateRangePicker = ({
  dateRange,
  onDateRangeChange,
  disabled = false,
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState<CalendarDateRange | undefined>();
  const [selectionStep, setSelectionStep] = useState<"start" | "end">("start");

  const formatDateRange = (range: DateRange) => {
    const from = dayjs(range.from).format("MMM D");
    const to = dayjs(range.to).format("MMM D, YYYY");
    return `${from} - ${to}`;
  };

  const getButtonText = () => {
    if (tempRange?.from && !tempRange?.to) {
      // Show partial selection
      const from = dayjs(tempRange.from).format("MMM D");
      return `${from} - Click to select end date`;
    }

    if (dateRange) {
      return formatDateRange(dateRange);
    }

    return "Select date range";
  };

  const handlePredefinedRange = (range: PredefinedRange) => {
    const newRange = range.getRange();
    onDateRangeChange(newRange);
    setTempRange(undefined);
    setSelectionStep("start");
    setIsOpen(false);
  };

  const handleDayClick = (day: Date) => {
    if (selectionStep === "start") {
      // First click - set start date (start of day)
      const newRange = { from: getStartOfDay(day).toDate(), to: undefined };
      setTempRange(newRange);
      setSelectionStep("end");
    } else {
      // Second click - set end date
      if (tempRange?.from) {
        const startDate = tempRange.from;
        const endDate = day;

        // Ensure start date is before end date
        const finalStartDate = startDate < endDate ? startDate : endDate;
        const finalEndDate = startDate < endDate ? endDate : startDate;

        const newRange = {
          from: finalStartDate,
          to: getEndOfDay(finalEndDate).toDate(),
        };
        setTempRange(newRange);

        // Finalize the selection
        onDateRangeChange({
          label: "Custom",
          value: "custom",
          from: finalStartDate,
          to: getEndOfDay(finalEndDate).toDate(),
        });

        setTempRange(undefined);
        setSelectionStep("start");
        setIsOpen(false);
      }
    }
  };

  // Convert our DateRange to CalendarDateRange for the calendar component
  // Use tempRange if available (for partial selections), otherwise use the current dateRange
  const calendarDateRange: CalendarDateRange | undefined =
    tempRange ||
    (dateRange
      ? {
          from: dateRange.from,
          to: dateRange.to,
        }
      : undefined);

  return (
    <>
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (open) {
            // Clear temp range when opening to allow fresh selection
            setTempRange(undefined);
            setSelectionStep("start");
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-white/80 backdrop-blur-sm border-gray-200",
              !dateRange && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {getButtonText()}
            <ChevronDown className="ml-auto h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-sm font-medium">Custom Range</h4>
                {tempRange?.from && !tempRange?.to && (
                  <p className="text-xs text-muted-foreground">
                    Click to select end date
                  </p>
                )}
              </div>
              {(tempRange?.from || dateRange) && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={disabled}
                  onClick={() => {
                    setTempRange(undefined);
                    setSelectionStep("start");
                    if (dateRange?.value === "custom") {
                      onDateRangeChange({
                        label: "Last 7 days",
                        value: "1week",
                        from: getStartOfDay(
                          dayjs().subtract(7, "day")
                        ).toDate(),
                        to: getEndOfDay(dayjs()).toDate(),
                      });
                    }
                  }}
                  className="h-6 px-2 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
            <CalendarComponent
              mode="range"
              selected={calendarDateRange}
              onDayClick={handleDayClick}
              numberOfMonths={1}
              className="rounded-md border"
              disabled={disabled}
            />
          </div>
        </PopoverContent>
      </Popover>
      <div className="p-3 border-b w-full">
        <div className="flex flex-wrap flex-row gap-1">
          {predefinedRanges
            .filter((range) => range.value !== "custom")
            .map((range) => (
              <Button
                key={range.value}
                variant={"outline"}
                size="default"
                className={cn(
                  "justify-start text-xs h-8",
                  dateRange?.value === range.value &&
                    "bg-green-100 border border-green-300 hover:bg-green-100"
                )}
                onClick={() => handlePredefinedRange(range)}
                disabled={disabled}
              >
                {range.label}
              </Button>
            ))}
          <Button
            key={"custom"}
            variant={"outline"}
            size="default"
            className={cn(
              "justify-start text-xs h-8",
              dateRange?.value === "custom" &&
                "bg-green-100 border border-green-300 hover:bg-green-100"
            )}
            onClick={() =>
              // trigger the custom range picker
              setIsOpen(true)
            }
            disabled={disabled}
          >
            Custom
          </Button>
        </div>
      </div>
    </>
  );
};
