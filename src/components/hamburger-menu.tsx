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
  BabyIcon,
  ArrowLeftRight,
  ChartLine,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useApplicationStore } from "../stores/applicationStore";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";
import { useBabyFromUrl } from "../hooks/useBabyFromUrl";

const HamburgerMenu = () => {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const session = useAuth();
  const { currentBaby } = useBabyFromUrl();
  const isHamburgerMenuOpen = useApplicationStore.use.isHamburgerMenuOpen();
  const toggleHamburgerMenu = useApplicationStore.use.toggleHamburgerMenu();

  const handleSignOut = async () => {
    toggleHamburgerMenu();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSwitchBaby = () => {
    toggleHamburgerMenu();
    router.push("/babies");
  };

  const handleNavigate = (href: string) => {
    if (session?.user) {
      toggleHamburgerMenu();
      router.push(`/${session.user.id}${href}`);
    }
  };

  const handleBabyNavigate = (href: string) => {
    toggleHamburgerMenu();
    router.push(`/babies/${currentBaby?.id}${href}`);
  };

  const babyMenuItems = [
    {
      label: "Baby Settings",
      icon: BabyIcon,
      navigate: () => handleBabyNavigate("/settings"),
      color: "pink",
      caption: "Manage your baby's settings",
    },
    {
      label: "Reminders",
      icon: Bell,
      navigate: () => handleBabyNavigate("/reminders"),
      color: "purple",
      caption: "Set up reminders for important events",
    },
  ];

  const userMenuItems = [
    {
      label: "Account Settings",
      icon: Settings,
      navigate: () => handleNavigate("/settings"),
      color: "green",
      caption: "Manage your account settings",
    },
  ];

  const dataAndAnalyticsMenuItems = [
    {
      label: "Analytics",
      icon: ChartLine,
      navigate: () => handleBabyNavigate("/analytics"),
      color: "purple",
      caption: "View your baby's analytics",
    },
    {
      label: "History",
      icon: History,
      navigate: () => handleBabyNavigate("/history"),
      color: "blue",
      caption: "View your baby's growth history",
    },
  ];

  const showBabyMenus = pathname.includes("/babies/");

  return (
    <Sheet open={isHamburgerMenuOpen} onOpenChange={toggleHamburgerMenu}>
      <SheetTrigger disabled={!session} asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-80 max-h-[100vh] min-h-[100vh] overflow-y-scroll"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-left">
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

          <Separator />

          {/* Menu Items */}
          <div className="space-y-2">
            {showBabyMenus && (
              <div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                    Baby Management
                  </h3>

                  <Button
                    variant="ghost"
                    onClick={handleSwitchBaby}
                    className="w-full justify-start h-12 text-left"
                  >
                    <ArrowLeftRight className="w-5 h-5 mr-3 text-orange-600" />
                    <div>
                      <div className="font-medium">Switch Baby</div>
                      <div className="text-xs text-gray-500">
                        Switch between your babies
                      </div>
                    </div>
                  </Button>

                  {babyMenuItems.map((item) => {
                    if (!pathname.includes("/babies")) {
                      return null;
                    }

                    return (
                      <Button
                        variant="ghost"
                        key={item.label}
                        onClick={item.navigate}
                        disabled={!currentBaby}
                        className={`w-full justify-start h-12 text-left hover:bg-${item.color}-50`}
                      >
                        <item.icon
                          className={`w-5 h-5 mr-3 text-${item.color}-600`}
                        />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500">
                            {item.caption}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>

                {/* Data and analytics */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                    Data and analytics
                  </h3>
                  {/* User Menu Items */}
                  {dataAndAnalyticsMenuItems.map((item) => {
                    return (
                      <Button
                        variant="ghost"
                        key={item.label}
                        onClick={item.navigate}
                        className="w-full justify-start h-12 text-left"
                      >
                        <item.icon
                          className={`w-5 h-5 mr-3 text-${item.color}-600`}
                        />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500">
                            {item.caption}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
              Settings
            </h3>
            {userMenuItems.map((item) => {
              return (
                <Button
                  variant="ghost"
                  key={item.label}
                  onClick={item.navigate}
                  className="w-full justify-start h-12 text-left"
                >
                  <item.icon
                    className={`w-5 h-5 mr-3 text-${item.color}-600`}
                  />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.caption}</div>
                  </div>
                </Button>
              );
            })}
          </div>

          <Separator />

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

          {/* App Info */}
          <div className="pt-4 border-t">
            <div className="text-center text-xs text-gray-500">
              <p>BabyMax v0.1 Beta</p>
              <p className="mt-1">Made with ❤️ for families</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HamburgerMenu;
