import type React from "react";
import { QueryClientProvider } from "@/src/providers/query-client-provider";
import Header from "@/src/components/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider>
      <Header />
      {children}
    </QueryClientProvider>
  );
}
