"use client";

import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useBabyFromUrl } from "@/src/hooks/useBabyFromUrl";

const BabyLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { currentBaby } = useBabyFromUrl();

  const showBackButton = useMemo(() => {
    return pathname !== `/babies/${currentBaby?.id}`;
  }, [pathname, currentBaby?.id]);

  const handleBack = () => {
    router.push(`/babies/${currentBaby?.id}`);
  };

  return (
    <div className="flex flex-col gap-4">
      {currentBaby && showBackButton && (
        <div className="flex items-center gap-2 px-4 mt-4">
          <ChevronLeft onClick={handleBack} />
          <span className="text-lg font-medium">{currentBaby?.name}</span>
        </div>
      )}
      {children}
    </div>
  );
};

export default BabyLayout;
