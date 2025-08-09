export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  borderColor: string;
  color: string;
  component: React.ReactNode;
  iconComponent?: React.ElementType;
};
