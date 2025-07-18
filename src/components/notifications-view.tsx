"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Badge } from "components/ui/badge";
import {
  ArrowLeft,
  Bell,
  Plus,
  Trash2,
  Clock,
  Milk,
  Moon,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";

interface Reminder {
  id: string;
  type: "scheduled" | "interval";
  activity: "feeding" | "sleep" | "diaper" | "custom";
  title: string;
  time?: string; // for scheduled reminders
  intervalHours?: number; // for interval reminders
  enabled: boolean;
  lastTriggered?: Date;
}

interface NotificationsViewProps {
  onBack: () => void;
}

export function NotificationsView({ onBack }: NotificationsViewProps) {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      type: "scheduled",
      activity: "feeding",
      title: "Evening feeding time",
      time: "18:00",
      enabled: true,
    },
    {
      id: "2",
      type: "interval",
      activity: "feeding",
      title: "Feeding reminder",
      intervalHours: 3,
      enabled: true,
      lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    type: "scheduled",
    activity: "feeding",
    enabled: true,
  });

  const addReminder = () => {
    if (!newReminder.title) return;

    const reminder: Reminder = {
      id: Date.now().toString(),
      type: newReminder.type || "scheduled",
      activity: newReminder.activity || "feeding",
      title: newReminder.title,
      time: newReminder.time,
      intervalHours: newReminder.intervalHours,
      enabled: true,
    };

    setReminders((prev) => [...prev, reminder]);
    setNewReminder({
      type: "scheduled",
      activity: "feeding",
      enabled: true,
    });
    setShowAddModal(false);
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case "feeding":
        return <Milk className="w-4 h-4" />;
      case "sleep":
        return <Moon className="w-4 h-4" />;
      case "diaper":
        return <span className="text-sm">💩</span>;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case "feeding":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "sleep":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "diaper":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getNextTrigger = (reminder: Reminder) => {
    if (reminder.type === "scheduled" && reminder.time) {
      const [hours, minutes] = reminder.time.split(":").map(Number);
      const now = new Date();
      const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes
      );
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

      return today > now ? today : tomorrow;
    } else if (
      reminder.type === "interval" &&
      reminder.intervalHours &&
      reminder.lastTriggered
    ) {
      return new Date(
        reminder.lastTriggered.getTime() +
          reminder.intervalHours * 60 * 60 * 1000
      );
    }
    return null;
  };

  const formatTimeUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff < 0) return "Overdue";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `in ${hours}h ${minutes}m`;
    }
    return `in ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-600" />
              <h1 className="text-lg font-bold text-gray-800">Notifications</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Add Reminder Button */}
        <Button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Reminder
        </Button>

        {/* Active Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-purple-600" />
              Active Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders.filter((r) => r.enabled).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No active reminders.</p>
                <p className="text-xs mt-1">
                  Add some reminders to stay on track! 🔔
                </p>
              </div>
            ) : (
              reminders
                .filter((r) => r.enabled)
                .map((reminder) => {
                  const nextTrigger = getNextTrigger(reminder);
                  return (
                    <div
                      key={reminder.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(
                          reminder.activity
                        )}`}
                      >
                        {getActivityIcon(reminder.activity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">
                            {reminder.title}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {reminder.type === "scheduled"
                              ? "Scheduled"
                              : "Interval"}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {reminder.type === "scheduled" && reminder.time && (
                            <>Daily at {reminder.time}</>
                          )}
                          {reminder.type === "interval" &&
                            reminder.intervalHours && (
                              <>Every {reminder.intervalHours} hours</>
                            )}
                          {nextTrigger && (
                            <span className="ml-2 text-purple-600">
                              • {formatTimeUntil(nextTrigger)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReminder(reminder.id)}
                          className="text-gray-500"
                        >
                          <Clock className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReminder(reminder.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
            )}
          </CardContent>
        </Card>

        {/* Disabled Reminders */}
        {reminders.filter((r) => !r.enabled).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-500">
                <Clock className="w-5 h-5" />
                Disabled Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reminders
                .filter((r) => !r.enabled)
                .map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 opacity-60"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(
                        reminder.activity
                      )}`}
                    >
                      {getActivityIcon(reminder.activity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">
                          {reminder.title}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          Disabled
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {reminder.type === "scheduled" && reminder.time && (
                          <>Daily at {reminder.time}</>
                        )}
                        {reminder.type === "interval" &&
                          reminder.intervalHours && (
                            <>Every {reminder.intervalHours} hours</>
                          )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReminder(reminder.id)}
                        className="text-green-500"
                      >
                        <Clock className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteReminder(reminder.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-2">
              🔔 About Notifications
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • <strong>Scheduled:</strong> Reminders at specific times daily
              </li>
              <li>
                • <strong>Interval:</strong> Reminders based on time since last
                activity
              </li>
              <li>• Enable browser notifications for alerts</li>
              <li>• Reminders help maintain consistent routines</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Add Reminder Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-700">
              <Plus className="w-5 h-5" />
              Add New Reminder
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Reminder Type */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Reminder Type</Label>
              <RadioGroup
                value={newReminder.type}
                onValueChange={(value: any) =>
                  setNewReminder((prev) => ({ ...prev, type: value }))
                }
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-purple-200 bg-purple-50">
                  <RadioGroupItem value="scheduled" id="scheduled" />
                  <Label htmlFor="scheduled" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Scheduled (Daily at specific time)
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-purple-200 bg-purple-50">
                  <RadioGroupItem value="interval" id="interval" />
                  <Label htmlFor="interval" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Interval (Every X hours)
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Activity Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Activity</Label>
              <Select
                value={newReminder.activity}
                onValueChange={(value: any) =>
                  setNewReminder((prev) => ({ ...prev, activity: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feeding">🍼 Feeding</SelectItem>
                  <SelectItem value="sleep">😴 Sleep</SelectItem>
                  <SelectItem value="diaper">💩 Diaper</SelectItem>
                  <SelectItem value="custom">⚡ Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Reminder Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Evening feeding time"
                value={newReminder.title || ""}
                onChange={(e) =>
                  setNewReminder((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            {/* Time (for scheduled) */}
            {newReminder.type === "scheduled" && (
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={newReminder.time || ""}
                  onChange={(e) =>
                    setNewReminder((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                />
              </div>
            )}

            {/* Interval (for interval) */}
            {newReminder.type === "interval" && (
              <div className="space-y-2">
                <Label htmlFor="interval" className="text-sm font-medium">
                  Interval (hours)
                </Label>
                <Input
                  id="interval"
                  type="number"
                  min="1"
                  max="24"
                  placeholder="3"
                  value={newReminder.intervalHours || ""}
                  onChange={(e) =>
                    setNewReminder((prev) => ({
                      ...prev,
                      intervalHours: Number.parseInt(e.target.value),
                    }))
                  }
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={addReminder}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
              >
                Add Reminder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
