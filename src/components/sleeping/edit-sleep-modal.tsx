"use client";

import { useState, useEffect } from "react";
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

const EditSleepModal = ({
  open,
  onClose,
  onSave,
  onDelete,
  sleep,
}: EditSleepModalProps) => {
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
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <Moon className="w-5 h-5" />
            Edit Sleep
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Start Date and Time */}
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

          {/* End Date and Time */}
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
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="px-3"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSleepModal;
