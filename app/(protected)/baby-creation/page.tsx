"use client";

import type React from "react";

import { useState } from "react";
import { Plus, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/hooks/useAuth";
import useBabies from "@/src/hooks/data/queries/useBabies";

const BabyCreationScreen = () => {
  const session = useAuth();
  const user = session?.user;
  const { data: babies, isLoading, isError } = useBabies(user?.id ?? "");

  const [showCreateForm, setShowCreateForm] = useState(
    babies && babies.length === 0
  );
  const [babyName, setBabyName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"boy" | "girl" | "other">("boy");

  const handleCreateBaby = (e: React.FormEvent) => {
    e.preventDefault();
    if (!babyName.trim() || !birthDate) return;

    const newBaby = {
      name: babyName.trim(),
      birthDate,
      gender,
      avatar: getAvatarForGender(gender),
    };

    setBabyName("");
    setBirthDate("");
    setGender("boy");
    setShowCreateForm(false);
  };

  const getAvatarForGender = (gender: string) => {
    switch (gender) {
      case "boy":
        return "👶🏻";
      case "girl":
        return "👶🏻";
      case "other":
        return "👶";
      default:
        return "👶";
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? "" : "s"} old`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks === 1 ? "" : "s"} old`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months === 1 ? "" : "s"} old`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years === 1 ? "" : "s"}${
        remainingMonths > 0
          ? ` and ${remainingMonths} month${remainingMonths === 1 ? "" : "s"}`
          : ""
      } old`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Message */}
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

        {/* Babies Grid */}
        {babies && babies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {babies?.map((baby) => (
              <Card
                key={baby.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-pink-300"
                // onClick={() => onSelectBaby(baby)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">{baby.name}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {baby.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{calculateAge(baby.birth_date)}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Born: {new Date(baby.birth_date).toLocaleDateString()}
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white">
                    Select {baby.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add New Baby Button */}
        {babies && babies.length > 0 && !showCreateForm && (
          <div className="text-center mb-8">
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Baby
            </Button>
          </div>
        )}

        {/* Create Baby Form */}
        {showCreateForm && (
          <Card className="max-w-md mx-auto shadow-xl border-2 border-pink-200">
            <CardHeader className="bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <span className="w-5 h-5">👶</span>
                Create Baby Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleCreateBaby} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="babyName">Baby's Name</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 h-4 w-4 text-gray-400">
                      👤
                    </span>
                    <Input
                      id="babyName"
                      type="text"
                      placeholder="Enter baby's name"
                      value={babyName}
                      onChange={(e) => setBabyName(e.target.value)}
                      required
                      className="pl-10 border-pink-200 focus:border-pink-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                      className="pl-10 border-pink-200 focus:border-pink-400"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={gender}
                    onValueChange={(value: any) => setGender(value)}
                  >
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-pink-200 bg-pink-50">
                      <RadioGroupItem value="boy" id="boy" />
                      <Label htmlFor="boy" className="flex-1 cursor-pointer">
                        👶🏻 Boy
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-pink-200 bg-pink-50">
                      <RadioGroupItem value="girl" id="girl" />
                      <Label htmlFor="girl" className="flex-1 cursor-pointer">
                        👶🏻 Girl
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-pink-200 bg-pink-50">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="flex-1 cursor-pointer">
                        👶 Prefer not to say
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex gap-3 pt-4">
                  {babies && babies.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                  >
                    Create Baby Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {babies?.length === 0 && !showCreateForm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👶</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No babies yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first baby profile to get started!
            </p>
            <Button
              onClick={() => setShowCreateForm(true)}
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

export default BabyCreationScreen;
