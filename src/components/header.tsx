"use client";

import { Baby } from "lucide-react";
import { useRouter } from "next/navigation";
import HamburgerMenu from "./hamburger-menu";

const Header = () => {
  const router = useRouter();

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-10">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2"
            onClick={() => router.push("/babies")}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full flex items-center justify-center">
              <Baby className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">BabyBuddy</h1>
            </div>
          </div>
          <HamburgerMenu />
        </div>
      </div>
    </div>
  );
};

export default Header;
