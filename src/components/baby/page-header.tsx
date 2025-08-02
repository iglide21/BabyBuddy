"use client";

import { useBabyFromUrl } from "@/src/hooks/useBabyFromUrl";
import { ArrowLeft, Bell } from "lucide-react";
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

  return null;
};

export default PageHeader;
