"use client";

import { useRouter } from "next/navigation";
import { ChartColumnBig, Calendar, History, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useBabyFromUrl } from "@/src/hooks";
import type { Baby } from "@/types/data/babies/types";
import { cn } from "@/src/lib/utils";

const tabs = [
  {
    label: "Today",
    icon: Calendar,
    href: (currentBaby: Baby) => `/babies/${currentBaby?.id}`,
    tabColor: "bg-gradient-to-b from-blue-600/70 to-blue-400/70",
  },
  {
    label: "Analytics",
    icon: ChartColumnBig,
    href: (currentBaby: Baby) => `/babies/${currentBaby?.id}/analytics`,
    tabColor: "bg-gradient-to-b from-green-600/70 to-green-400/70",
  },
  {
    label: "History",
    icon: History,
    href: (currentBaby: Baby) => `/babies/${currentBaby?.id}/history`,
    tabColor: "bg-gradient-to-b from-orange-700/70 to-orange-500/70",
  },
  {
    label: "Settings",
    icon: Settings,
    href: (currentBaby: Baby) => `/babies/${currentBaby?.id}/settings`,
    tabColor: "bg-gradient-to-b from-purple-600/70 to-purple-400/70",
  },
];

const BottomTabBar = () => {
  const { currentBaby } = useBabyFromUrl();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | undefined>(tabs[0].label);

  useEffect(() => {
    if (currentBaby) {
      setActiveTab(tabs[0].label);
    }
  }, [currentBaby]);

  const handleTabClick = (tab: (typeof tabs)[number]) => {
    setActiveTab(tab.label);
    router.push(tab.href(currentBaby));
  };

  return (
    <div className="flex items-center max-w-screen-md mx-auto w-full fixed bottom-0 bg-white border border-t-2 border-pink-100">
      {tabs.map((tab) => (
        <div
          key={tab.label}
          className={cn(
            "flex flex-col basis-1/4 items-center justify-center gap-2 p-3 rounded-lg cursor-pointer data-[active=true]:text-gray-100 z-10"
          )}
          onClick={() => handleTabClick(tab)}
          data-active={activeTab === tab.label}
        >
          <tab.icon className="w-5 h-5" />
          <span className="text-sm">{tab.label}</span>
        </div>
      ))}
      <div
        className={cn(
          "h-full w-1/4 absolute top-0 transition-all duration-300",
          activeTab === tabs[0].label && `left-0 ${tabs[0].tabColor}`,
          activeTab === tabs[1].label && `left-1/4 ${tabs[1].tabColor}`,
          activeTab === tabs[2].label && `left-2/4 ${tabs[2].tabColor}`,
          activeTab === tabs[3].label && `left-3/4 ${tabs[3].tabColor}`
        )}
      />
    </div>
  );
};

export default BottomTabBar;
