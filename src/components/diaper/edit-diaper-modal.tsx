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
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import { Trash2 } from "lucide-react";

interface DiaperLog {
  id: string;
  timestamp: Date;
  type: "wet" | "dirty" | "both";
  notes?: string;
}

interface EditDiaperModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (log: DiaperLog) => void;
  onDelete: (id: string) => void;
  diaper: DiaperLog | null;
}

export function EditDiaperModal({
  open,
  onClose,
  onSave,
  onDelete,
  diaper,
}: EditDiaperModalProps) {
  const [type, setType] = useState<"wet" | "dirty" | "both">("wet");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  // Populate form when diaper changes
  useEffect(() => {
    if (diaper) {
      setType(diaper.type);
      setDate(diaper.timestamp.toISOString().split("T")[0]);
      setTime(diaper.timestamp.toTimeString().slice(0, 5));
      setNotes(diaper.notes || "");
      setShowNotes(!!diaper.notes);
    }
  }, [diaper]);

  const handleSave = () => {
    if (!diaper) return;

    const [hours, minutes] = time.split(":").map(Number);
    const timestamp = new Date(date);
    timestamp.setHours(hours, minutes, 0, 0);

    const updatedLog: DiaperLog = {
      ...diaper,
      timestamp,
      type,
      notes: notes || undefined,
    };

    onSave(updatedLog);
    onClose();
  };

  const handleDelete = () => {
    if (!diaper) return;
    if (confirm("Are you sure you want to delete this diaper entry?")) {
      onDelete(diaper.id);
      onClose();
    }
  };

  const getTypeEmoji = (diaperType: string) => {
    switch (diaperType) {
      case "wet":
        return "💧";
      case "dirty":
        return "💩";
      case "both":
        return "💧💩";
      default:
        return "👶";
    }
  };

  if (!diaper) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-700">
            <span className="text-lg">👶</span>
            Edit Diaper Change
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-lg"
              />
            </div>
          </div>

          {/* Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Diaper Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(value: any) => setType(value)}
            >
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-green-200 bg-green-50">
                <RadioGroupItem value="wet" id="wet" />
                <Label htmlFor="wet" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💧</span>
                    <span>Wet only</span>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-green-200 bg-green-50">
                <RadioGroupItem value="dirty" id="dirty" />
                <Label htmlFor="dirty" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💩</span>
                    <span>Dirty only</span>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-green-200 bg-green-50">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💧💩</span>
                    <span>Wet & Dirty</span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
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
                placeholder="e.g., blowout, rash noticed, used cream..."
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
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              Save Changes {getTypeEmoji(type)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
