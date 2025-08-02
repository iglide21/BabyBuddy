"use client";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider as MuiLocalizationProvider } from "@mui/x-date-pickers";

const LocalizationProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MuiLocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"de-DE"}>
      {children}
    </MuiLocalizationProvider>
  );
};

export default LocalizationProvider;
