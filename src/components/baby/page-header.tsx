"use client";

import { useBabyFromUrl } from "@/src/hooks/useBabyFromUrl";
import { ArrowLeft, Baby, Badge, Bell, History, Save } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";

const PageHeader = () => {
  const { currentBaby } = useBabyFromUrl();
  const router = useRouter();
  const pathname = usePathname();

  if (!currentBaby) return null;

  if (pathname === `/babies/${currentBaby.id}/reminders`) {
    return (
      <div className="flex items-center gap-3 my-2">
        <Button
          onClick={() => router.push(`/babies/${currentBaby.id}`)}
          variant="ghost"
          size="sm"
          className="font-bold text-gray-500 focus:bg-transparent focus:text-gray-500 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-gray-400" />
          {currentBaby.name}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="font-bold text-gray-800 focus:bg-transparent focus:text-gray-800 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-gray-400" />
          Reminders
        </Button>
      </div>
    );
  }

  if (pathname === `/babies/${currentBaby.id}/settings`) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  router.push(`/babies/${currentBaby.id}`);
                }}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Baby className="w-5 h-5 text-pink-600" />
                <h1 className="text-lg font-bold text-gray-800">
                  {currentBaby.name}'s Settings
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  router.push(`/babies/${currentBaby.id}/history`);
                }}
                className="bg-white"
              >
                <History className="w-4 h-4 mr-2" />
                Change History
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PageHeader;
