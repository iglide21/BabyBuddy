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
import { Milk, Trash2 } from "lucide-react";

interface FeedingLog {
  id: string;
  timestamp: Date;
  type: "breast" | "bottle" | "solid";
  amount?: number;
  duration?: number;
  notes?: string;
}

interface EditFeedingModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (log: FeedingLog) => void;
  onDelete: (id: string) => void;
  feeding: FeedingLog | null;
}

const EditFeedingModal = ({
  open,
  onClose,
  onSave,
  onDelete,
  feeding,
}: EditFeedingModalProps) => {
  const [type, setType] = useState<"breast" | "bottle" | "solid">("bottle");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  // Populate form when feeding changes
  useEffect(() => {
    if (feeding) {
      setType(feeding.type);
      setDate(feeding.timestamp.toISOString().split("T")[0]);
      setTime(feeding.timestamp.toTimeString().slice(0, 5));
      setAmount(feeding.amount?.toString() || "");
      setDuration(feeding.duration?.toString() || "");
      setNotes(feeding.notes || "");
      setShowNotes(!!feeding.notes);
    }
  }, [feeding]);

  const handleSave = () => {
    if (!feeding) return;

    const [hours, minutes] = time.split(":").map(Number);
    const timestamp = new Date(date);
    timestamp.setHours(hours, minutes, 0, 0);

    const updatedLog: FeedingLog = {
      ...feeding,
      timestamp,
      type,
      ...(type === "bottle" && amount && { amount: Number.parseFloat(amount) }),
      ...(type === "breast" &&
        duration && { duration: Number.parseInt(duration) }),
      notes: notes || undefined,
    };

    onSave(updatedLog);
    onClose();
  };

  const handleDelete = () => {
    if (!feeding) return;
    if (confirm("Are you sure you want to delete this feeding entry?")) {
      onDelete(feeding.id);
      onClose();
    }
  };

  if (!feeding) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-700">
            <Milk className="w-5 h-5" />
            Edit Feeding
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
            <Label className="text-sm font-medium">Feeding Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(value: any) => setType(value)}
            >
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-orange-200 bg-orange-50">
                <RadioGroupItem value="bottle" id="bottle" />
                <Label htmlFor="bottle" className="flex-1 cursor-pointer">
                  🍼 Bottle
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-orange-200 bg-orange-50">
                <RadioGroupItem value="breast" id="breast" />
                <Label htmlFor="breast" className="flex-1 cursor-pointer">
                  🤱 Breast
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-orange-200 bg-orange-50">
                <RadioGroupItem value="solid" id="solid" />
                <Label htmlFor="solid" className="flex-1 cursor-pointer">
                  🥄 Solid Food
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Amount/Duration */}
          {type === "bottle" && (
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount (oz)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.5"
                placeholder="e.g., 4"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
              />
            </div>
          )}

          {type === "breast" && (
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                placeholder="e.g., 15"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="text-lg"
              />
            </div>
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
                placeholder="e.g., Baby was very hungry, spit up a bit..."
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
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditFeedingModal;
