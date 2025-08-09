import { OnboardingStep } from "@/types/quiz";
import { Card, CardTitle, CardHeader, CardContent } from "../../ui/card";

const CurrentStepContainer = ({
  currentStep,
  children,
}: {
  currentStep: OnboardingStep;
  children: React.ReactNode;
}) => {
  return (
    <Card
      className={`bg-gradient-to-br ${currentStep.bgColor} ${currentStep.borderColor} border-2`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {currentStep.iconComponent && (
            <div
              className={`bg-gradient-to-br ${currentStep.color} rounded-xl flex items-center justify-center shadow-sm p-2`}
            >
              <currentStep.iconComponent className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <div className="text-lg">{currentStep.title}</div>
            <div className="text-sm font-normal text-gray-600">
              {currentStep.description}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CurrentStepContainer;
