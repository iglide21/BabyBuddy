import LocalizationProvider from "@/src/providers/localization-provider";

const BabiesLayout = ({ children }: { children: React.ReactNode }) => {
  return <LocalizationProvider>{children}</LocalizationProvider>;
};

export default BabiesLayout;
