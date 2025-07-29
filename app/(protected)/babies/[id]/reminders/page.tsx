"use client";

import { CardTitle, DialogHeader } from "@/src/components/ui";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Input from "@mui/material/Input";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Switch } from "@radix-ui/react-switch";
import {
  Milk,
  Moon,
  Bell,
  ArrowLeft,
  Plus,
  Trash2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { Label } from "components/ui/label";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { toast } from "@/src/hooks/use-toast";
import { useRouter } from "next/navigation";

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

const NotificationsView = () => {
  const router = useRouter();
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
      enabled: false,
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
    if (!newReminder.title) {
      toast({
        title: "Please enter a reminder title",
        variant: "destructive",
      });
      return;
    }

    if (newReminder.type === "scheduled" && !newReminder.time) {
      toast({
        title: "Please select a time for scheduled reminder",
        variant: "destructive",
      });
      return;
    }

    if (newReminder.type === "interval" && !newReminder.intervalHours) {
      toast({
        title: "Please enter interval hours",
        variant: "destructive",
      });
      return;
    }

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
    toast({
      title: "Reminder added successfully!",
      variant: "default",
    });
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    toast({
      title: "Reminder deleted",
      variant: "default",
    });
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const newEnabled = !r.enabled;
          toast({
            title: `Reminder ${newEnabled ? "enabled" : "disabled"}`,
            variant: newEnabled ? "default" : "default",
          });
          return { ...r, enabled: newEnabled };
        }
        return r;
      })
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
        return "text-orange-600";
      case "sleep":
        return "text-blue-600";
      case "diaper":
        return "text-green-600";
      default:
        return "text-gray-600";
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

  const activeReminders = reminders.filter((r) => r.enabled);
  const inactiveReminders = reminders.filter((r) => !r.enabled);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
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
        {activeReminders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-green-600" />
                Active Reminders
                <Badge className="bg-green-100 text-green-700">
                  {activeReminders.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeReminders.map((reminder) => {
                const nextTrigger = getNextTrigger(reminder);
                return (
                  <div
                    key={reminder.id}
                    className="p-4 rounded-lg border border-green-200 bg-green-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`${getActivityColor(reminder.activity)}`}
                        >
                          {getActivityIcon(reminder.activity)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">
                            {reminder.title}
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
                              <span className="ml-2 text-purple-600 font-medium">
                                • {formatTimeUntil(nextTrigger)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={reminder.enabled}
                          onCheckedChange={() => toggleReminder(reminder.id)}
                          className="data-[state=checked]:bg-green-600"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReminder(reminder.id)}
                          className="text-red-500 hover:bg-red-50 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="secondary" className="bg-white">
                        {reminder.type === "scheduled"
                          ? "Scheduled"
                          : "Interval"}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-white capitalize"
                      >
                        {reminder.activity}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Inactive Reminders */}
        {inactiveReminders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-500">
                <Clock className="w-5 h-5" />
                Disabled Reminders
                <Badge variant="secondary">{inactiveReminders.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {inactiveReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50 opacity-75"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-gray-400">
                        {getActivityIcon(reminder.activity)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-600">
                          {reminder.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reminder.type === "scheduled" && reminder.time && (
                            <>Daily at {reminder.time}</>
                          )}
                          {reminder.type === "interval" &&
                            reminder.intervalHours && (
                              <>Every {reminder.intervalHours} hours</>
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={() => toggleReminder(reminder.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteReminder(reminder.id)}
                        className="text-red-500 hover:bg-red-50 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="secondary" className="bg-white">
                      Disabled
                    </Badge>
                    <Badge variant="secondary" className="bg-white capitalize">
                      {reminder.activity}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {reminders.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No reminders set up yet.</p>
              <p className="text-sm text-gray-400 mt-1">
                Add some reminders to stay on track! 🔔
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-2">
              🔔 About Reminders
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • <strong>Scheduled:</strong> Daily reminders at specific times
              </li>
              <li>
                • <strong>Interval:</strong> Reminders based on time since last
                activity
              </li>
              <li>• Use the switch to quickly enable/disable reminders</li>
              <li>• Reminders help maintain consistent baby care routines</li>
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
};

export default NotificationsView;
