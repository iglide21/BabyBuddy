import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/src/lib/utils";
import { Toaster } from "@/src/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BabyBuddy - Baby Care Tracker",
  description: "Simple, intuitive baby care tracking for feeding and sleep",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "overflow-x-hidden")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
