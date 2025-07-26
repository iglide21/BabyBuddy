"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import {
  Menu,
  History,
  Bell,
  Settings,
  LogOut,
  User,
  Baby,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useCurrentBabyStore } from "../stores/currentBabyStore";
import { useApplicationStore } from "../stores/applicationStore";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

const menuItems = [
  {
    label: "History",
    icon: History,
    href: "/history",
    color: "blue",
  },
  {
    label: "Reminders",
    icon: Bell,
    href: "/notifications",
    color: "purple",
  },
  {
    label: "Account Settings",
    icon: Settings,
    href: "/settings",
    color: "green",
  },
];

const HamburgerMenu = () => {
  const supabase = createClient();
  const router = useRouter();

  const session = useAuth();
  const currentBaby = useCurrentBabyStore.use.currentBaby();
  const isHamburgerMenuOpen = useApplicationStore.use.isHamburgerMenuOpen();
  const toggleHamburgerMenu = useApplicationStore.use.toggleHamburgerMenu();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const beforeNavigate = () => {
    toggleHamburgerMenu();
  };

  const handleSwitchBaby = () => {
    beforeNavigate();
    router.push("/babies");
  };

  return (
    <Sheet open={isHamburgerMenuOpen} onOpenChange={toggleHamburgerMenu}>
      <SheetTrigger disabled={!session} asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-left">
            <User className="w-5 h-5 text-purple-600" />
            Menu
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* User Info */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-800">
                  {session?.user.user_metadata.name}
                </div>
              </div>
            </div>
          </div>

          {/* Current Baby */}
          {currentBaby && (
            <div className="p-4 bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg border border-pink-200">
              <div className="flex items-center gap-3">
                <Baby className="w-5 h-5 text-pink-600" />
                <div>
                  <div className="text-sm text-gray-600">
                    Currently tracking
                  </div>
                  <div className="font-medium text-gray-800">
                    {currentBaby?.name}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Button
                variant="ghost"
                key={item.label}
                onClick={() => router.push(item.href)}
                className={`w-full justify-start h-12 text-left hover:bg-${item.color}-50`}
              >
                <item.icon className={`w-5 h-5 mr-3 text-${item.color}-600`} />
                <div>
                  <div className="font-medium">{item.label}</div>
                </div>
              </Button>
            ))}
          </div>

          <Separator />

          {/* Navigation */}
          <div className="space-y-2">
            {currentBaby && (
              <Button
                variant="ghost"
                onClick={handleSwitchBaby}
                className="w-full justify-start h-12 text-left hover:bg-orange-50"
              >
                <Baby className="w-5 h-5 mr-3 text-orange-600" />
                <div>
                  <div className="font-medium">Switch Baby</div>
                </div>
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start h-12 text-left hover:bg-red-50 text-red-600"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <div>
                <div className="font-medium">Sign Out</div>
                <div className="text-xs text-red-400">End current session</div>
              </div>
            </Button>
          </div>

          {/* App Info */}
          <div className="pt-4 border-t">
            <div className="text-center text-xs text-gray-500">
              <p>BabyBuddy v2.0</p>
              <p className="mt-1">Made with ❤️ for families</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HamburgerMenu;
