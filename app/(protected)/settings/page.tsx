"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Baby, Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";

interface SettingsViewProps {
  babyName: string;
  birthDate: string;
  onBabyNameChange: (name: string) => void;
  onBirthDateChange: (date: string) => void;
  onBack: () => void;
  onClearData: () => void;
}

export function SettingsPage() {
  const [tempName, setTempName] = useState("Maksim");
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [tempBirthDate, setTempBirthDate] = useState("2025-08-15");

  const handleSaveName = () => {
    setTempName(tempName.trim() || "Baby");
  };

  const handleSaveBirthDate = () => {
    setTempBirthDate(tempBirthDate);
  };

  const handleClearData = () => {
    setShowClearDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Baby Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="w-5 h-5 text-pink-600" />
              Baby Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="babyName" className="text-sm font-medium">
                Baby's Name
              </Label>
              <div className="flex gap-2">
                <Input
                  id="babyName"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Enter baby's name"
                  className="flex-1"
                />
                <Button
                  onClick={handleSaveName}
                  disabled={tempName.trim() === ""}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Save
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                This name will appear throughout the app
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-sm font-medium">
                Birth Date
              </Label>
              <div className="flex gap-2">
                <Input
                  id="birthDate"
                  type="date"
                  value={tempBirthDate}
                  onChange={(e) => setTempBirthDate(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSaveBirthDate}
                  disabled={tempBirthDate === ""}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Save
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Used to calculate baby's age and milestones
              </p>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>About BabyBuddy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                BabyBuddy helps you track your baby's feeding and sleep patterns
                with ease.
              </p>
              <p className="mb-2">
                Designed for tired parents who need simple, one-handed logging.
              </p>
              <p className="text-xs text-gray-500">
                Version 1.0 • Made with ❤️ for parents
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Trash2 className="w-5 h-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Data Storage</p>
                  <p className="text-yellow-700 mt-1">
                    All your data is stored locally on this device. Make sure to
                    back up important information.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowClearDialog(true)}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
            <p className="text-xs text-gray-500 text-center">
              This will permanently delete all feeding, sleep, and diaper logs
            </p>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-2">
              💡 Tips for Better Tracking
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Log activities as they happen for accuracy</li>
              <li>• Use the quick add buttons for faster entry</li>
              <li>• Add notes for important details</li>
              <li>• Check your history to spot patterns</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Clear Data Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Clear All Data?
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              This will permanently delete all feeding, sleep, and diaper logs.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearData}
              className="flex-1"
            >
              Clear Data
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SettingsPage;
