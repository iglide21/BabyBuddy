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
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4 text-gray-400" />
        </Button>
        <Button
          onClick={() => router.push(`/babies/${currentBaby.id}`)}
          variant="ghost"
          size="sm"
          className="font-bold text-gray-500 focus:bg-transparent"
        >
          {currentBaby.name}
        </Button>
        <ArrowLeft className="w-4 h-4 text-gray-400" />
        <Button variant="ghost" size="sm" className="font-bold text-gray-800">
          Reminders
        </Button>
      </div>
    );
  }

  return null;
};

export default PageHeader;
