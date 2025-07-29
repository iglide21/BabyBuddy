"use client";

import { Baby } from "lucide-react";
import { useRouter } from "next/navigation";
import HamburgerMenu from "./hamburger-menu";
import { useBabyFromUrl } from "../hooks/useBabyFromUrl";

const Header = () => {
  const { currentBaby } = useBabyFromUrl();
  const router = useRouter();

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-10">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2"
            onClick={() => router.push(`/babies/${currentBaby?.id}`)}
          >
            <div className="text-2xl">
              {currentBaby?.gender === "male" ? "👶🏻" : "👧🏻"}
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                {currentBaby?.name}
              </h1>
              <p className="text-xs text-gray-600">Tracking activities</p>
            </div>
          </div>
          <HamburgerMenu />
        </div>
      </div>
    </div>
  );
};

export default Header;
