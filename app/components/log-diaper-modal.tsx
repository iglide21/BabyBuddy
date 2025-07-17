"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface DiaperLog {
  timestamp: Date
  type: "wet" | "dirty" | "both"
  notes?: string
}

interface LogDiaperModalProps {
  open: boolean
  onClose: () => void
  onSave: (log: DiaperLog) => void
}

export function LogDiaperModal({ open, onClose, onSave }: LogDiaperModalProps) {
  const [type, setType] = useState<"wet" | "dirty" | "both">("wet")
  const [time, setTime] = useState(() => {
    const now = new Date()
    return now.toTimeString().slice(0, 5)
  })
  const [date, setDate] = useState(() => {
    const now = new Date()
    return now.toISOString().split("T")[0]
  })
  const [notes, setNotes] = useState("")
  const [showNotes, setShowNotes] = useState(false)

  const handleSave = () => {
    const [hours, minutes] = time.split(":").map(Number)
    const timestamp = new Date(date)
    timestamp.setHours(hours, minutes, 0, 0)

    const log: DiaperLog = {
      timestamp,
      type,
      ...(notes && { notes }),
    }

    onSave(log)

    // Reset form
    setNotes("")
    setShowNotes(false)
    const now = new Date()
    setDate(now.toISOString().split("T")[0])

    setTimeout(() => {
      onClose()
    }, 100)
  }

  const resetTime = () => {
    const now = new Date()
    setTime(now.toTimeString().slice(0, 5))
  }

  const getTypeEmoji = (diaperType: string) => {
    switch (diaperType) {
      case "wet":
        return "💧"
      case "dirty":
        return "💩"
      case "both":
        return "💧💩"
      default:
        return "👶"
    }
  }

  const getTypeDescription = (diaperType: string) => {
    switch (diaperType) {
      case "wet":
        return "Wet only"
      case "dirty":
        return "Dirty only"
      case "both":
        return "Wet & Dirty"
      default:
        return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-700">
            <span className="text-lg">👶</span>
            Log Diaper Change
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Date
              </Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="text-lg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium">
                Time
              </Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="text-lg" />
            </div>
          </div>

          {/* Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Diaper Type</Label>
            <RadioGroup value={type} onValueChange={(value: any) => setType(value)}>
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
            <Button type="button" variant="ghost" onClick={() => setShowNotes(true)} className="w-full text-gray-600">
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
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
              Save Change {getTypeEmoji(type)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
