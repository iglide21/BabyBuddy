"use client";

import { Card, CardContent } from "components/ui/card";
import { LogFeedingModal } from "components/feeding";
import { LogSleepModal } from "components/sleeping";
import { LogDiaperModal } from "components/diaper";
import QuickStats from "@/src/components/quick-stats";
import TodaysActivities from "@/src/components/todays-activities";
import QuickActions from "@/src/components/quick-actions";

export default function BabyBuddyApp() {
  // if (currentView === "history") {
  //   return (
  //     <>
  //       <HistoryView
  //         feedingLogs={feedingLogs}
  //         sleepLogs={sleepLogs}
  //         diaperLogs={diaperLogs}
  //         onBack={() => setCurrentView("dashboard")}
  //         formatTime={formatTime}
  //         formatDuration={formatDuration}
  //         onEditFeeding={handleEditFeeding}
  //         onEditSleep={handleEditSleep}
  //         onEditDiaper={handleEditDiaper}
  //       />

  //       {/* Edit Modals for History View */}
  //       <EditFeedingModal
  //         open={showEditFeedingModal}
  //         onClose={() => {
  //           setShowEditFeedingModal(false);
  //           setEditingFeeding(null);
  //         }}
  //         onSave={editFeedingLog}
  //         onDelete={deleteFeedingLog}
  //         feeding={editingFeeding}
  //       />

  //       <EditSleepModal
  //         open={showEditSleepModal}
  //         onClose={() => {
  //           setShowEditSleepModal(false);
  //           setEditingSleep(null);
  //         }}
  //         onSave={editSleepLog}
  //         onDelete={deleteSleepLog}
  //         sleep={editingSleep}
  //       />

  //       <EditDiaperModal
  //         open={showEditDiaperModal}
  //         onClose={() => {
  //           setShowEditDiaperModal(false);
  //           setEditingDiaper(null);
  //         }}
  //         onSave={editDiaperLog}
  //         onDelete={deleteDiaperLog}
  //         diaper={editingDiaper}
  //       />

  //       {/* AI Chat available in all views */}
  //       <AIChat
  //         feedingLogs={feedingLogs}
  //         sleepLogs={sleepLogs}
  //         diaperLogs={diaperLogs}
  //         babyName={babyName}
  //         birthDate={birthDate}
  //       />
  //     </>
  //   );
  // }

  // if (currentView === "settings") {
  //   return (
  //     <>
  //       <SettingsView
  //         babyName={babyName}
  //         birthDate={birthDate}
  //         onBabyNameChange={(name) => {
  //           setBabyName(name);
  //           localStorage.setItem("babybuddy-baby-name", name);
  //         }}
  //         onBirthDateChange={(date) => {
  //           setBirthDate(date);
  //           localStorage.setItem("babybuddy-birth-date", date);
  //         }}
  //         onBack={() => setCurrentView("dashboard")}
  //         onClearData={() => {
  //           setFeedingLogs([]);
  //           setSleepLogs([]);
  //           setDiaperLogs([]);
  //           localStorage.removeItem("babybuddy-feedings");
  //           localStorage.removeItem("babybuddy-sleep");
  //           localStorage.removeItem("babybuddy-diapers");
  //           localStorage.removeItem("babybuddy-birth-date");
  //         }}
  //       />

  //       {/* AI Chat available in all views */}
  //       <AIChat
  //         feedingLogs={feedingLogs}
  //         sleepLogs={sleepLogs}
  //         diaperLogs={diaperLogs}
  //         babyName={babyName}
  //         birthDate={birthDate}
  //       />
  //     </>
  //   );
  // }

  // if (currentView === "notifications") {
  //   return (
  //     <>
  //       <NotificationsView onBack={() => setCurrentView("dashboard")} />

  //       {/* AI Chat available in all views */}
  //       <AIChat
  //         feedingLogs={feedingLogs}
  //         sleepLogs={sleepLogs}
  //         diaperLogs={diaperLogs}
  //         babyName={babyName}
  //         birthDate={birthDate}
  //       />
  //     </>
  //   );
  // }

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

      {/* Add Modals */}
      <LogFeedingModal />
      <LogSleepModal />
      <LogDiaperModal />

      {/* Edit Modals */}
      {/* <EditFeedingModal
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
      /> */}

      {/* AI Chat - Available on all views */}
      {/* <AIChat
        feedingLogs={feedingLogs}
        sleepLogs={sleepLogs}
        diaperLogs={diaperLogs}
        babyName={babyName}
        birthDate={birthDate}
      /> */}
    </div>
  );
}
