"use client";

import { EditFeedingModal, LogFeedingModal } from "components/feeding";
import { EditSleepModal, LogSleepModal } from "components/sleeping";
import { EditDiaperModal, LogDiaperModal } from "components/diaper";
import QuickStats from "@/src/components/quick-stats";
import TodaysActivities from "@/src/components/todays-activities";
import QuickActions from "@/src/components/quick-actions";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function BabyBuddyApp() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"de-DE"}>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          <QuickStats />
          <QuickActions />

          {/* Active Sleep Alert */}
          {/* {activeSleep && (
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
                    updateSleepLog(activeSleep.id, {
                      endTime: getNow().toDate(),
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  End Sleep
                </Button>
              </div>
            </CardContent>
          </Card>
        )} */}

          <TodaysActivities />

          {/* Encouraging Message */}
          {/* {feedings && sleeps && diapers && (
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-700">
                {feedings?.length >= 6 &&
                sleeps?.length >= 10 &&
                diapers?.length >= 6
                  ? "Amazing job today! You're both doing great! 🌟"
                  : feedings?.length >= 3 && diapers?.length >= 3
                  ? "You're doing wonderful! Keep up the great work! 💪"
                  : "Every moment counts. You're an amazing parent! ❤️"}
              </p>
            </CardContent>
          </Card>
        )} */}
        </div>

        <LogFeedingModal />
        <LogSleepModal />
        <LogDiaperModal />

        <EditSleepModal />
        <EditFeedingModal />
        <EditDiaperModal />
      </div>
    </LocalizationProvider>
  );
}
