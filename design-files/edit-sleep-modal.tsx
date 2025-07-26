"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Moon, Trash2 } from "lucide-react";

interface SleepLog {
  id: string;
  startTime: Date;
  endTime?: Date;
  notes?: string;
}

interface EditSleepModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (log: SleepLog) => void;
  onDelete: (id: string) => void;
  sleep: SleepLog | null;
}

export function EditSleepModal({
  open,
  onClose,
  onSave,
  onDelete,
  sleep,
}: EditSleepModalProps) {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  // Populate form when sleep changes
  useEffect(() => {
    if (sleep) {
      setStartDate(sleep.startTime.toISOString().split("T")[0]);
      setStartTime(sleep.startTime.toTimeString().slice(0, 5));

      if (sleep.endTime) {
        setEndDate(sleep.endTime.toISOString().split("T")[0]);
        setEndTime(sleep.endTime.toTimeString().slice(0, 5));
      } else {
        const now = new Date();
        setEndDate(now.toISOString().split("T")[0]);
        setEndTime(now.toTimeString().slice(0, 5));
      }

      setNotes(sleep.notes || "");
      setShowNotes(!!sleep.notes);
    }
  }, [sleep]);

  const handleSave = () => {
    if (!sleep) return;

    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const start = new Date(startDate);
    start.setHours(startHours, startMinutes, 0, 0);

    const end = new Date(endDate);
    end.setHours(endHours, endMinutes, 0, 0);

    // Ensure end time is after start time
    if (end <= start) {
      alert("End time must be after start time");
      return;
    }

    const updatedLog: SleepLog = {
      ...sleep,
      startTime: start,
      endTime: end,
      notes: notes || undefined,
    };

    onSave(updatedLog);
    onClose();
  };

  const handleDelete = () => {
    if (!sleep) return;
    if (confirm("Are you sure you want to delete this sleep entry?")) {
      onDelete(sleep.id);
      onClose();
    }
  };

  if (!sleep) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto bg-white rounded-3xl border-0 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-t-3xl p-6 -m-6 mb-6">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Moon className="w-5 h-5" />
            </div>
            Edit Sleep
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-2">
          {/* Start Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="startDate"
                className="text-sm font-semibold text-gray-700"
              >
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-base border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-0 h-12"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="startTime"
                className="text-sm font-semibold text-gray-700"
              >
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="text-base border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-0 h-12"
              />
            </div>
          </div>

          {/* End Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="endDate"
                className="text-sm font-semibold text-gray-700"
              >
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-base border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-0 h-12"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="endTime"
                className="text-sm font-semibold text-gray-700"
              >
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="text-base border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-0 h-12"
              />
            </div>
          </div>

          {/* Notes Toggle */}
          {!showNotes && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowNotes(true)}
              className="w-full text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl h-12 border-2 border-dashed border-gray-300 hover:border-blue-300 transition-all duration-200"
            >
              + Add note (optional)
            </Button>
          )}

          {/* Notes */}
          {showNotes && (
            <div className="space-y-2">
              <Label
                htmlFor="notes"
                className="text-sm font-semibold text-gray-700"
              >
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="e.g., sleep in crib, very fussy before sleep..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-0 resize-none"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border-2 border-gray-200 hover:bg-gray-50 font-semibold bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="h-12 px-4 rounded-xl bg-red-500 hover:bg-red-600 font-semibold"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
