"use client";

import { useState, useEffect } from "react";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { HistoryView } from "components/history-view";
import { SettingsView } from "components/settings-view";
import { NotificationsView } from "components/notifications-view";
import { AIChat } from "components/ai-chat";
import { LogFeedingModal, EditFeedingModal } from "components/feeding";
import { LogSleepModal, EditSleepModal } from "components/sleeping";
import { LogDiaperModal, EditDiaperModal } from "components/diaper";
import { Plus, Baby, Moon, Milk, Calendar, Edit } from "lucide-react";
import { useApplicationStore } from "@/src/stores/applicationStore";
import QuickStats from "@/src/components/quick-stats";
import TodaysActivities from "@/src/components/todays-activities";

interface FeedingLog {
  id: string;
  timestamp: Date;
  type: "breast" | "bottle" | "solid";
  amount?: number;
  duration?: number;
  notes?: string;
}

interface SleepLog {
  id: string;
  startTime: Date;
  endTime?: Date;
  notes?: string;
}

interface DiaperLog {
  id: string;
  timestamp: Date;
  type: "wet" | "dirty" | "both";
  notes?: string;
}

type LogEntry =
  | (FeedingLog & { logType: "feeding" })
  | (SleepLog & { logType: "sleep" })
  | (DiaperLog & { logType: "diaper" });

export default function BabyBuddyApp() {
  const currentView = useApplicationStore.use.currentView();
  const setCurrentView = useApplicationStore.use.setCurrentView();

  const [feedingLogs, setFeedingLogs] = useState<FeedingLog[]>([]);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [diaperLogs, setDiaperLogs] = useState<DiaperLog[]>([]);
  const [showFeedingModal, setShowFeedingModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [showDiaperModal, setShowDiaperModal] = useState(false);
  const [showEditFeedingModal, setShowEditFeedingModal] = useState(false);
  const [showEditSleepModal, setShowEditSleepModal] = useState(false);
  const [showEditDiaperModal, setShowEditDiaperModal] = useState(false);
  const [editingFeeding, setEditingFeeding] = useState<FeedingLog | null>(null);
  const [editingSleep, setEditingSleep] = useState<SleepLog | null>(null);
  const [editingDiaper, setEditingDiaper] = useState<DiaperLog | null>(null);
  const [babyName, setBabyName] = useState("Baby");
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
    const savedFeedings = localStorage.getItem("babybuddy-feedings");
    const savedSleep = localStorage.getItem("babybuddy-sleep");
    const savedBabyName = localStorage.getItem("babybuddy-baby-name");
    const savedDiapers = localStorage.getItem("babybuddy-diapers");
    const savedBirthDate = localStorage.getItem("babybuddy-birth-date");

    if (savedFeedings) {
      const parsed = JSON.parse(savedFeedings);
      setFeedingLogs(
        parsed.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }))
      );
    }

    if (savedSleep) {
      const parsed = JSON.parse(savedSleep);
      setSleepLogs(
        parsed.map((log: any) => ({
          ...log,
          startTime: new Date(log.startTime),
          endTime: log.endTime ? new Date(log.endTime) : undefined,
        }))
      );
    }

    if (savedBabyName) {
      setBabyName(savedBabyName);
    }

    if (savedDiapers) {
      const parsed = JSON.parse(savedDiapers);
      setDiaperLogs(
        parsed.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }))
      );
    }

    if (savedBirthDate) {
      setBirthDate(savedBirthDate);
    }
  }, []);

  // Save data to localStorage whenever logs change
  useEffect(() => {
    localStorage.setItem("babybuddy-feedings", JSON.stringify(feedingLogs));
  }, [feedingLogs]);

  useEffect(() => {
    localStorage.setItem("babybuddy-sleep", JSON.stringify(sleepLogs));
  }, [sleepLogs]);

  useEffect(() => {
    localStorage.setItem("babybuddy-diapers", JSON.stringify(diaperLogs));
  }, [diaperLogs]);

  const addFeedingLog = (log: Omit<FeedingLog, "id">) => {
    const newLog = { ...log, id: Date.now().toString() };
    setFeedingLogs((prev) => [newLog, ...prev]);
  };

  const addSleepLog = (log: Omit<SleepLog, "id">) => {
    const newLog = { ...log, id: Date.now().toString() };
    setSleepLogs((prev) => [newLog, ...prev]);
  };

  const addDiaperLog = (log: Omit<DiaperLog, "id">) => {
    const newLog = { ...log, id: Date.now().toString() };
    setDiaperLogs((prev) => [newLog, ...prev]);
  };

  const updateSleepLog = (id: string, updates: Partial<SleepLog>) => {
    setSleepLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, ...updates } : log))
    );
  };

  // Edit functions
  const editFeedingLog = (log: FeedingLog) => {
    setFeedingLogs((prev) =>
      prev.map((item) => (item.id === log.id ? log : item))
    );
  };

  const editSleepLog = (log: SleepLog) => {
    setSleepLogs((prev) =>
      prev.map((item) => (item.id === log.id ? log : item))
    );
  };

  const editDiaperLog = (log: DiaperLog) => {
    setDiaperLogs((prev) =>
      prev.map((item) => (item.id === log.id ? log : item))
    );
  };

  // Delete functions
  const deleteFeedingLog = (id: string) => {
    setFeedingLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const deleteSleepLog = (id: string) => {
    setSleepLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const deleteDiaperLog = (id: string) => {
    setDiaperLogs((prev) => prev.filter((log) => log.id !== id));
  };

  // Handle edit clicks
  const handleEditFeeding = (feeding: FeedingLog) => {
    setEditingFeeding(feeding);
    setShowEditFeedingModal(true);
  };

  const handleEditSleep = (sleep: SleepLog) => {
    setEditingSleep(sleep);
    setShowEditSleepModal(true);
  };

  const handleEditDiaper = (diaper: DiaperLog) => {
    setEditingDiaper(diaper);
    setShowEditDiaperModal(true);
  };

  // Get today's logs
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const todayFeedings = feedingLogs.filter(
    (log) => log.timestamp >= todayStart && log.timestamp < todayEnd
  );

  const todaySleep = sleepLogs.filter(
    (log) => log.startTime >= todayStart && log.startTime < todayEnd
  );

  const todayDiapers = diaperLogs.filter(
    (log) => log.timestamp >= todayStart && log.timestamp < todayEnd
  );

  // Combine and sort today's activities
  const todayActivities: LogEntry[] = [
    ...todayFeedings.map((log) => ({ ...log, logType: "feeding" as const })),
    ...todaySleep.map((log) => ({ ...log, logType: "sleep" as const })),
    ...todayDiapers.map((log) => ({ ...log, logType: "diaper" as const })),
  ].sort((a, b) => {
    const timeA =
      a.logType === "feeding"
        ? a.timestamp
        : a.logType === "diaper"
        ? a.timestamp
        : a.startTime;
    const timeB =
      b.logType === "feeding"
        ? b.timestamp
        : b.logType === "diaper"
        ? b.timestamp
        : b.startTime;
    return timeB.getTime() - timeA.getTime();
  });

  // Calculate stats
  const totalFeedingsToday = todayFeedings.length;
  const totalSleepToday = todaySleep.reduce((total, log) => {
    if (log.endTime) {
      return total + (log.endTime.getTime() - log.startTime.getTime());
    }
    return total;
  }, 0);
  const totalSleepHours =
    Math.round((totalSleepToday / (1000 * 60 * 60)) * 10) / 10;

  const totalDiapersToday = todayDiapers.length;
  const activeSleep = sleepLogs.find((log) => !log.endTime);

  const formatDuration = (startTime: Date, endTime: Date) => {
    const diff = endTime.getTime() - startTime.getTime();

    // Handle negative duration (shouldn't happen with proper validation)
    if (diff < 0) {
      return "Invalid duration";
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (currentView === "history") {
    return (
      <>
        <HistoryView
          feedingLogs={feedingLogs}
          sleepLogs={sleepLogs}
          diaperLogs={diaperLogs}
          onBack={() => setCurrentView("dashboard")}
          formatTime={formatTime}
          formatDuration={formatDuration}
          onEditFeeding={handleEditFeeding}
          onEditSleep={handleEditSleep}
          onEditDiaper={handleEditDiaper}
        />

        {/* Edit Modals for History View */}
        <EditFeedingModal
          open={showEditFeedingModal}
          onClose={() => {
            setShowEditFeedingModal(false);
            setEditingFeeding(null);
          }}
          onSave={editFeedingLog}
          onDelete={deleteFeedingLog}
          feeding={editingFeeding}
        />

        <EditSleepModal
          open={showEditSleepModal}
          onClose={() => {
            setShowEditSleepModal(false);
            setEditingSleep(null);
          }}
          onSave={editSleepLog}
          onDelete={deleteSleepLog}
          sleep={editingSleep}
        />

        <EditDiaperModal
          open={showEditDiaperModal}
          onClose={() => {
            setShowEditDiaperModal(false);
            setEditingDiaper(null);
          }}
          onSave={editDiaperLog}
          onDelete={deleteDiaperLog}
          diaper={editingDiaper}
        />

        {/* AI Chat available in all views */}
        <AIChat
          feedingLogs={feedingLogs}
          sleepLogs={sleepLogs}
          diaperLogs={diaperLogs}
          babyName={babyName}
          birthDate={birthDate}
        />
      </>
    );
  }

  if (currentView === "settings") {
    return (
      <>
        <SettingsView
          babyName={babyName}
          birthDate={birthDate}
          onBabyNameChange={(name) => {
            setBabyName(name);
            localStorage.setItem("babybuddy-baby-name", name);
          }}
          onBirthDateChange={(date) => {
            setBirthDate(date);
            localStorage.setItem("babybuddy-birth-date", date);
          }}
          onBack={() => setCurrentView("dashboard")}
          onClearData={() => {
            setFeedingLogs([]);
            setSleepLogs([]);
            setDiaperLogs([]);
            localStorage.removeItem("babybuddy-feedings");
            localStorage.removeItem("babybuddy-sleep");
            localStorage.removeItem("babybuddy-diapers");
            localStorage.removeItem("babybuddy-birth-date");
          }}
        />

        {/* AI Chat available in all views */}
        <AIChat
          feedingLogs={feedingLogs}
          sleepLogs={sleepLogs}
          diaperLogs={diaperLogs}
          babyName={babyName}
          birthDate={birthDate}
        />
      </>
    );
  }

  if (currentView === "notifications") {
    return (
      <>
        <NotificationsView onBack={() => setCurrentView("dashboard")} />

        {/* AI Chat available in all views */}
        <AIChat
          feedingLogs={feedingLogs}
          sleepLogs={sleepLogs}
          diaperLogs={diaperLogs}
          babyName={babyName}
          birthDate={birthDate}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <QuickStats />

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={() => setShowFeedingModal(true)}
            className="h-16 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white shadow-lg"
            size="lg"
          >
            <Plus className="w-6 h-6 mr-2" />
            <div className="text-left">
              <div className="font-semibold">Feeding</div>
              <div className="text-xs opacity-90">Log a feed</div>
            </div>
          </Button>

          <Button
            onClick={() => setShowSleepModal(true)}
            className="h-16 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg"
            size="lg"
          >
            <Plus className="w-6 h-6 mr-2" />
            <div className="text-left">
              <div className="font-semibold">Sleep</div>
              <div className="text-xs opacity-90">Log sleep</div>
            </div>
          </Button>

          <Button
            onClick={() => setShowDiaperModal(true)}
            className="h-16 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white shadow-lg"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-1" />
            <div className="text-left">
              <div className="font-semibold text-sm">Diaper</div>
              <div className="text-xs opacity-90">Log change</div>
            </div>
          </Button>
        </div>

        {/* Active Sleep Alert */}
        {activeSleep && (
          <Card className="bg-blue-100 border-blue-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className={`w-5 h-5 text-blue-600 animate-pulse`} />
                  <div>
                    <div className="font-medium text-blue-800">
                      Sleep in progress
                    </div>
                    <div className="text-sm text-blue-600">
                      Started at {formatTime(activeSleep.startTime)}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    updateSleepLog(activeSleep.id, { endTime: new Date() });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  End Sleep
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <TodaysActivities />

        {/* Encouraging Message */}
        {todayActivities.length > 0 && (
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-700">
                {totalFeedingsToday >= 6 &&
                totalSleepHours >= 10 &&
                totalDiapersToday >= 6
                  ? "Amazing job today! You're both doing great! 🌟"
                  : totalFeedingsToday >= 3 && totalDiapersToday >= 3
                  ? "You're doing wonderful! Keep up the great work! 💪"
                  : "Every moment counts. You're an amazing parent! ❤️"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Modals */}
      <LogFeedingModal
        open={showFeedingModal}
        onClose={() => setShowFeedingModal(false)}
        onSave={addFeedingLog}
      />

      <LogSleepModal
        open={showSleepModal}
        onClose={() => setShowSleepModal(false)}
        onSave={addSleepLog}
        activeSleep={activeSleep}
        onUpdateSleep={updateSleepLog}
      />

      <LogDiaperModal
        open={showDiaperModal}
        onClose={() => setShowDiaperModal(false)}
        onSave={addDiaperLog}
      />

      {/* Edit Modals */}
      <EditFeedingModal
        open={showEditFeedingModal}
        onClose={() => {
          setShowEditFeedingModal(false);
          setEditingFeeding(null);
        }}
        onSave={editFeedingLog}
        onDelete={deleteFeedingLog}
        feeding={editingFeeding}
      />

      <EditSleepModal
        open={showEditSleepModal}
        onClose={() => {
          setShowEditSleepModal(false);
          setEditingSleep(null);
        }}
        onSave={editSleepLog}
        onDelete={deleteSleepLog}
        sleep={editingSleep}
      />

      <EditDiaperModal
        open={showEditDiaperModal}
        onClose={() => {
          setShowEditDiaperModal(false);
          setEditingDiaper(null);
        }}
        onSave={editDiaperLog}
        onDelete={deleteDiaperLog}
        diaper={editingDiaper}
      />

      {/* AI Chat - Available on all views */}
      <AIChat
        feedingLogs={feedingLogs}
        sleepLogs={sleepLogs}
        diaperLogs={diaperLogs}
        babyName={babyName}
        birthDate={birthDate}
      />
    </div>
  );
}
