import PageHeader from "@/src/components/baby/page-header";

const BabyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <PageHeader />
      {children}
    </div>
  );
};

export default BabyLayout;
