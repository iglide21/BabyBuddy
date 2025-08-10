"use client";

import { useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import { Progress } from "@/src/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Ruler,
  Stethoscope,
  FileText,
} from "lucide-react";
import { Baby, BloodType } from "@/types/data/babies/types";
import { useApplicationStore } from "@/src/stores/applicationStore";
import BirthInformationStep from "./onboarding/birth-information-step";
import CurrentStepContainer from "./onboarding/current-step-container";
import CurrentMeasurementsStep from "./onboarding/current-measurements-step";
import NotesStep from "./onboarding/notes-step";
import { toast } from "sonner";
import { OnboardingStep } from "@/types/quiz";
import { useUpdateBaby } from "@/src/hooks/data/mutations";
import MedicalInformationStep from "./onboarding/medical-information-step";
import { z } from "zod";

const babyQuizFormSchema = z.object({
  // Birth Information
  birth_weight: z.number().nullable(),
  birth_length: z.number().nullable(),
  blood_type: z.string().nullable(),

  // Current Measurements
  current_weight: z.number().nullable(),
  current_length: z.number().nullable(),
  head_circumference: z.number().nullable(),

  // Medical Information
  allergies: z.array(z.string()),
  medications: z.array(z.string()),
  pediatrician_name: z.string().nullable(),
  pediatrician_phone: z.string().nullable(),
  pediatrician_email: z.string().nullable(),
  emergency_contact_name: z.string().nullable(),
  emergency_contact_phone: z.string().nullable(),
  emergency_contact_relationship: z.string().nullable(),

  // Notes
  notes: z.string().nullable(),
});

type BabyQuizFormValues = z.infer<typeof babyQuizFormSchema>;

export function BabyOnboardingQuiz() {
  const currentModal = useApplicationStore.use.currentModal();
  const closeModal = useApplicationStore.use.closeModal();
  const [currentStep, setCurrentStep] = useState(0);
  const { mutate: updateBaby, isPending } = useUpdateBaby();

  const { baby = {} as Baby } = currentModal?.data || {};

  const isOpen = useMemo(() => {
    return currentModal?.type === "onboarding_quiz";
  }, [currentModal]);

  const form = useForm<BabyQuizFormValues>({
    mode: "onChange",
    defaultValues: {
      allergies: baby.allergies || [],
      medications: baby.medications || [],
      pediatrician_name: baby.pediatrician_name || null,
      pediatrician_phone: baby.pediatrician_phone || null,
      pediatrician_email: baby.pediatrician_email || null,
      emergency_contact_name: baby.emergency_contact_name || null,
      emergency_contact_phone: baby.emergency_contact_phone || null,
      notes: baby.notes || null,
      birth_weight: baby.birth_weight || null,
      birth_length: baby.birth_length || null,
      blood_type: baby.blood_type || null,
      current_weight: baby.current_weight || null,
      current_length: baby.current_length || null,
      head_circumference: baby.head_circumference || null,
    },
  });

  const { reset, handleSubmit } = form;

  const steps: OnboardingStep[] = [
    {
      id: "birth-info",
      title: "Birth Information",
      description: "Let's start with some basic birth details",
      iconComponent: Heart,
      color: "from-red-400 to-pink-500",
      bgColor: "from-red-50 to-pink-50",
      borderColor: "border-red-200",
      component: <BirthInformationStep />,
    },
    {
      id: "measurements",
      title: "Current Measurements",
      description: "Track your baby's current growth",
      iconComponent: Ruler,
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      component: <CurrentMeasurementsStep />,
    },
    {
      id: "medical",
      title: "Medical Information",
      description: "Important health and contact details",
      iconComponent: Stethoscope,
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      component: <MedicalInformationStep />,
    },
    {
      id: "notes",
      title: "Additional Notes",
      description: "Any other important information",
      iconComponent: FileText,
      color: "from-purple-400 to-indigo-500",
      bgColor: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-200",
      component: <NotesStep />,
    },
  ];

  const currentStepData = useMemo(
    () => steps[currentStep],
    [currentStep, steps]
  );
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onClose = () => {
    reset();
    closeModal();
  };

  const onSubmit = (data: BabyQuizFormValues) => {
    console.log(data);

    updateBaby({
      babyId: baby.id,
      currentValues: {
        ...data,
        blood_type: data.blood_type as BloodType,
      },
      previousValues: null,
    });

    onClose();
    toast.success(`${baby.name}'s profile setup completed! 🎉`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto p-0 border-none max-h-[90vh] h-70vh flex flex-col overflow-y-scroll">
        <DialogHeader className="p-6 bg-gradient-to-r from-pink-400 to-purple-400 text-white">
          <DialogTitle className="flex flex-col items-center gap-3 ">
            <div className="text-xl">Setting up {baby?.name}'s Profile</div>
            <div className="text-sm font-normal text-white">
              Help us learn more about your baby
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-8 p-4 flex-1">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          {/* Step Indicators */}
          <FormProvider {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <div className="flex justify-center">
                {steps
                  .filter((s, idx) => idx === currentStep)
                  .map((step, index) => {
                    const Icon = step.iconComponent;

                    return (
                      <div
                        key={step.id}
                        className="flex flex-col items-center space-y-2"
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 bg-gradient-to-br ${step.color} text-white shadow-lg scale-110`}
                        >
                          {Icon && <Icon className="w-5 h-5" />}
                        </div>
                        <div className="text-center">
                          <div className={`text-xs font-medium text-gray-800`}>
                            {step.title}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Current Step Content */}
              <CurrentStepContainer currentStep={currentStepData}>
                {currentStepData.component}
              </CurrentStepContainer>

              {/* Navigation Buttons - Fixed at bottom */}
              <div className="bg-white space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    {currentStep === steps.length - 1 ? (
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-gradient-to-r from-pink-400 to-purple-400 text-white"
                      >
                        <Sparkles className="w-4 h-4" />
                        Complete Setup
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={!form.formState.isValid}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Skip All Option */}
                <div className="text-center border-t pt-4">
                  <Button
                    variant="ghost"
                    // onClick={onSkip}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Skip all questions and start tracking activities
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
