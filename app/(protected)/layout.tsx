import type React from "react";
import { QueryClientProvider } from "@/src/providers/query-client-provider";
import Header from "@/src/components/header";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
