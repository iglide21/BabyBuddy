"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Trash2, AlertTriangle, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import InnerPageHeader from "@/src/components/inner-page-header";

export function SettingsPage() {
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleClearData = () => {
    setShowClearDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 p-4 space-y-4">
      <InnerPageHeader
        title="Settings"
        icon={<Settings className="w-5 h-5 text-gray-600" />}
      />
      <div className="max-w-md mx-auto space-y-4">
        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>About BabyMax</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                BabyMax helps you track your baby's patterns with ease.
              </p>
              <p className="mb-2">
                Designed for tired parents who need simple, one-handed logging.
              </p>
              <p className="text-xs text-gray-500">
                Version 0.1 Beta • Made with ❤️ for parents
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
