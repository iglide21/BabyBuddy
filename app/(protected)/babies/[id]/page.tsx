"use client";

import QuickStats from "@/src/components/quick-stats";
import TodaysActivities from "@/src/components/todays-activities";
import QuickActions from "@/src/components/quick-actions";

export default function BabyMaxApp() {
  return (
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
      </div>
    </div>
  );
}
