import { SettingsView } from "@/src/components/settings-view";

const SettingsPage = () => {
  return (
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
  );
};

export default SettingsPage;
