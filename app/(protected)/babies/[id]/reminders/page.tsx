"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui";
import { Bell, Plus, Clock } from "lucide-react";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { useApplicationStore } from "@/src/stores/applicationStore";
import { LogReminderModal, ReminderToggle } from "@/src/components/reminders";
import { useReminders } from "@/src/hooks/data/queries/useReminders";
import { useBabyFromUrl } from "@/src/hooks/useBabyFromUrl";

import type { Reminder } from "@/types/data/reminders/types";
import InnerPageHeader from "@/src/components/inner-page-header";

const NotificationsView = () => {
  const { currentBaby } = useBabyFromUrl();
  const showModal = useApplicationStore.use.showModal();
  const { data: reminders = [], isLoading } = useReminders(
    currentBaby?.id || ""
  );

  const getNextTrigger = (reminder: Reminder) => {
    if (reminder.type === "daily" && reminder.time_of_day) {
      const [hours, minutes] = reminder.time_of_day.split(":").map(Number);
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
      reminder.interval_minutes &&
      reminder.last_triggered
    ) {
      return new Date(
        new Date(reminder.last_triggered).getTime() +
          reminder.interval_minutes * 60 * 1000
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

  const activeReminders = reminders.filter((r) => r.is_active);
  const inactiveReminders = reminders.filter((r) => !r.is_active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 space-y-4 p-4">
      <InnerPageHeader
        title="Reminders"
        icon={<Bell className="w-5 h-5 text-gray-600" />}
      />

      {/* Add Reminder Button */}
      <Button
        onClick={() => showModal({ type: "reminder_log" })}
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
                      <div className="text-purple-600">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {reminder.label}
                        </div>
                        <div className="text-sm text-gray-600">
                          {reminder.type === "daily" &&
                            reminder.time_of_day && (
                              <>Daily at {reminder.time_of_day}</>
                            )}
                          {reminder.type === "interval" &&
                            reminder.interval_minutes && (
                              <>
                                Every{" "}
                                {Math.round(reminder.interval_minutes / 60)}{" "}
                                hours
                              </>
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
                      <ReminderToggle
                        reminder={reminder}
                        className="data-[state=checked]:bg-green-600"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="secondary" className="bg-white">
                      {reminder.type === "daily" ? "Daily" : "Interval"}
                    </Badge>
                    <Badge variant="secondary" className="bg-white capitalize">
                      Active
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
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-600">
                        {reminder.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reminder.type === "daily" && reminder.time_of_day && (
                          <>Daily at {reminder.time_of_day}</>
                        )}
                        {reminder.type === "interval" &&
                          reminder.interval_minutes && (
                            <>
                              Every {Math.round(reminder.interval_minutes / 60)}{" "}
                              hours
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ReminderToggle reminder={reminder} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="secondary" className="bg-white">
                    Disabled
                  </Badge>
                  <Badge variant="secondary" className="bg-white capitalize">
                    {reminder.type === "daily" ? "Daily" : "Interval"}
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
          <h3 className="font-medium text-gray-800 mb-2">🔔 About Reminders</h3>
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

      <LogReminderModal />
    </div>
  );
};

export default NotificationsView;
