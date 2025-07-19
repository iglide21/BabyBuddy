"use client";

import { Baby, Bell, History, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useApplicationStore } from "../stores/applicationStore";

const Header = () => {
  const setCurrentView = useApplicationStore.use.setCurrentView();
  const babyName = "Maksim";

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-10">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
              <Baby className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">BabyBuddy</h1>
              <p className="text-xs text-gray-600">Tracking for {babyName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView("notifications")}
              className="text-gray-600 flex flex-col items-center px-3 py-2"
            >
              <Bell className="w-4 h-4" />
              <span className="text-xs mt-1">Alerts</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView("history")}
              className="text-gray-600 flex flex-col items-center px-3 py-2 bg-blue-50 border border-blue-200"
            >
              <History className="w-4 h-4" />
              <span className="text-xs mt-1">History</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView("settings")}
              className="text-gray-600 flex flex-col items-center px-3 py-2"
            >
              <Settings className="w-4 h-4" />
              <span className="text-xs mt-1">Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
