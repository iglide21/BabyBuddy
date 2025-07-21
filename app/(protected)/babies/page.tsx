"use client";

import type React from "react";

import { Plus, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/hooks/useAuth";
import useBabies from "@/src/hooks/data/queries/useBabies";
import { Skeleton } from "@/src/components/ui/skeleton";
import BabyCard from "@/src/components/baby/baby-card";
import CreateBabyModal from "@/src/components/baby/create-baby-modal";
import { useApplicationStore } from "@/src/stores/applicationStore";

const BabiesScreen = () => {
  const session = useAuth();
  const user = session?.user;

  const showModal = useApplicationStore.use.showModal();
  const { data: babies, isLoading, isError } = useBabies(user?.id ?? "");

  const onAddBaby = () => {
    showModal("createBaby");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {isLoading && (
          <div className="space-y-4 w-full flex flex-col items-center justify-center">
            <div className="flex flex-col  items-center gap-2">
              <h2 className="text-2xl font-medium">
                Loading your little ones...
              </h2>
              <span className="text-2xl font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
              </span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full">
              <Skeleton className="w-full h-40 md:h-52 md:w-60 rounded-lg bg-gray-200 animate-pulse" />
              <Skeleton className="w-full h-40 md:h-52 md:w-60 rounded-lg bg-gray-200 animate-pulse" />
              <Skeleton className="w-full h-40 md:h-52 md:w-60 rounded-lg bg-gray-200 animate-pulse" />
              <Skeleton className="w-full h-40 md:h-52 md:w-60 rounded-lg bg-gray-200 animate-pulse" />
            </div>
          </div>
        )}
        {/* Welcome Message */}
        {babies && babies.length > 0 && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {babies?.length === 0
                  ? "Let's create your first baby profile!"
                  : "Select a baby to track"}
              </h2>
              <p className="text-gray-600">
                {babies?.length === 0
                  ? "Add your baby's information to start tracking their feeding, sleep, and diaper patterns."
                  : "Choose which baby you'd like to log activities for, or create a new baby profile."}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {babies?.map((baby) => (
                <BabyCard key={baby.id} baby={baby} />
              ))}
              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-pink-300"
                // onClick={() => onSelectBaby(baby)}
              >
                <CardContent
                  className="p-6 flex flex-col items-center justify-center"
                  onClick={onAddBaby}
                >
                  <div className="text-6xl mb-4">
                    <Plus
                      className="w-40 h-40 text-pink-500 opacity-50"
                      strokeWidth={1}
                    />
                  </div>
                  <h3
                    className="text-xl font-bold text-gray-500 mb-2"
                    onClick={onAddBaby}
                  >
                    Add Another Baby
                  </h3>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <CreateBabyModal />

        {/* Empty State */}
        {babies?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👶</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No babies yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first baby profile to get started!
            </p>
            <Button
              onClick={onAddBaby}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Baby Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BabiesScreen;
