import { Button } from "./ui";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const PageHeader = ({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="max-w-md mx-auto px-2 py-2">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              {icon}
              <h1 className="text-lg font-bold text-gray-800">{title}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
