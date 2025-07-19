"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import { Moon, Play, Square } from "lucide-react";
import { getNow, getTodayString, formatTime } from "lib/dayjs";
import dayjs from "lib/dayjs";

interface SleepLog {
  id: string;
  startTime: Date;
  endTime?: Date;
  notes?: string;
}

interface LogSleepModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (log: Omit<SleepLog, "id">) => void;
  activeSleep?: SleepLog;
  onUpdateSleep: (id: string, updates: Partial<SleepLog>) => void;
}

const LogSleepModal = ({
  open,
  onClose,
  onSave,
  activeSleep,
  onUpdateSleep,
}: LogSleepModalProps) => {
  const [logType, setLogType] = useState<"start" | "complete">("complete");
  const [startTime, setStartTime] = useState(() => {
    const now = getNow();
    return now.subtract(1, "hour").format("HH:mm"); // Default to 1 hour ago
  });
  const [endTime, setEndTime] = useState(() => {
    const now = getNow();
    return now.format("HH:mm");
  });
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  const [startDate, setStartDate] = useState(() => {
    return getTodayString();
  });
  const [endDate, setEndDate] = useState(() => {
    return getTodayString();
  });

  const handleSave = () => {
    if (logType === "start") {
      // Start a new sleep session
      const now = getNow();
      onSave({
        startTime: now.toDate(),
        notes: notes || undefined,
      });
    } else {
      // Log a complete sleep session
      const [startHours, startMinutes] = startTime.split(":").map(Number);
      const [endHours, endMinutes] = endTime.split(":").map(Number);

      const start = dayjs(startDate)
        .hour(startHours)
        .minute(startMinutes)
        .second(0)
        .millisecond(0);
      const end = dayjs(endDate)
        .hour(endHours)
        .minute(endMinutes)
        .second(0)
        .millisecond(0);

      // Ensure end time is after start time
      if (end.isSameOrBefore(start)) {
        alert("End time must be after start time");
        return;
      }

      onSave({
        startTime: start.toDate(),
        endTime: end.toDate(),
        notes: notes || undefined,
      });
    }

    // Reset form
    setNotes("");
    setShowNotes(false);
    const dateString = getTodayString();
    setStartDate(dateString);
    setEndDate(dateString);

    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleEndActiveSleep = () => {
    if (activeSleep) {
      onUpdateSleep(activeSleep.id, {
        endTime: getNow().toDate(),
        notes: notes || undefined,
      });
      setNotes("");
      setShowNotes(false);
      onClose();
    }
  };

  const resetToNow = (type: "start" | "end") => {
    const now = getNow();
    const timeString = now.format("HH:mm");
    if (type === "start") {
      setStartTime(timeString);
    } else {
      setEndTime(timeString);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <Moon className="w-5 h-5" />
            Log Sleep
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Active Sleep Alert */}
          {activeSleep && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Sleep in progress
                </span>
              </div>
              <p className="text-xs text-blue-600 mb-3">
                Started at {formatTime(activeSleep.startTime)}
              </p>
              <Button
                onClick={handleEndActiveSleep}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Square className="w-4 h-4 mr-2" />
                End Sleep Now
              </Button>
            </div>
          )}

          {/* Log Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              What would you like to do?
            </Label>
            <RadioGroup
              value={logType}
              onValueChange={(value: any) => setLogType(value)}
            >
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-blue-200 bg-blue-50">
                <RadioGroupItem value="start" id="start" />
                <Label htmlFor="start" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Start sleep tracking
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Baby just fell asleep
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-blue-200 bg-blue-50">
                <RadioGroupItem value="complete" id="complete" />
                <Label htmlFor="complete" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Log completed sleep
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Sleep session already finished
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date and Time Inputs for Complete Sleep */}
          {logType === "complete" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-sm font-medium">
                    Start Time
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="text-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-sm font-medium">
                    End Time
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="text-lg"
                  />
                </div>
              </div>
            </>
          )}

          {/* Notes Toggle */}
          {!showNotes && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowNotes(true)}
              className="w-full text-gray-600"
            >
              + Add note (optional)
            </Button>
          )}

          {/* Notes */}
          {showNotes && (
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="e.g., nap in crib, very fussy before sleep..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              {logType === "start" ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Sleep 😴
                </>
              ) : (
                <>Save Sleep 🌙</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogSleepModal;
