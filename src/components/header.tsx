"use client";

import { Baby } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import HamburgerMenu from "./hamburger-menu";
import { useBabyFromUrl } from "../hooks/useBabyFromUrl";

const Header = () => {
  const { currentBaby } = useBabyFromUrl();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogoClick = () => {
    if (pathname.includes("/babies")) {
      router.push(`/babies/${currentBaby?.id}`);
    } else {
      router.push("/babies");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-10 h-20">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {currentBaby ? (
            <div className="flex items-center gap-2" onClick={handleLogoClick}>
              <div className="text-2xl">
                {currentBaby.gender === "male" ? "👶🏻" : "👧🏻"}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">Baby Max</h1>
                <p className="text-xs text-gray-600">
                  Tracking for {currentBaby.name}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="text-2xl">
                <Baby className="w-8 h-8 text-gray-800" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">Baby Max</h1>
                <p className="text-xs text-gray-600">
                  Track your baby's journey
                </p>
              </div>
            </div>
          )}
          <HamburgerMenu />
        </div>
      </div>
    </div>
  );
};

export default Header;
