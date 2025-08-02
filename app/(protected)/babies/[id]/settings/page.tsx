"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import {
  ArrowLeft,
  Baby,
  Calendar,
  Ruler,
  Weight,
  Heart,
  User,
  History,
  Save,
  Edit3,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { useBabyFromUrl } from "@/src/hooks/useBabyFromUrl";
import { useUpdateBaby } from "@/src/hooks/data/mutations/useUpdateBaby";
import { calculateAge } from "@/src/lib/dayjs";
import dayjs from "@/src/lib/dayjs";
import { DateTimeField } from "@mui/x-date-pickers";

// Extended validation schema including all profile fields
const babyFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  birth_date: z.string().min(1, "Birth date is required"),
  gender: z.enum(["male", "female", "other"]),
  // Birth information
  birth_weight: z.number().optional(),
  birth_length: z.number().optional(),
  blood_type: z.string().optional(),
  // Current measurements
  current_weight: z.number().optional(),
  current_length: z.number().optional(),
  head_circumference: z.number().optional(),
  // Medical information
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  // Pediatrician information
  pediatrician_name: z.string().optional(),
  pediatrician_phone: z.string().optional(),
  pediatrician_email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  // Emergency contact
  emergency_contact_name: z.string().optional(),
  emergency_contact_relationship: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  // Notes
  notes: z.string().optional(),
});

type BabyFormData = z.infer<typeof babyFormSchema>;

const BabySettingsView = () => {
  const { currentBaby } = useBabyFromUrl();
  const { mutate: updateBaby, isPending } = useUpdateBaby();
  const [showHistory, setShowHistory] = useState(false);

  const form = useForm<BabyFormData>({
    resolver: zodResolver(babyFormSchema),
    defaultValues: {
      name: currentBaby?.name || "",
      birth_date: currentBaby?.birth_date || "",
      gender: currentBaby?.gender || "male",
      birth_weight: currentBaby?.birth_weight || undefined,
      birth_length: currentBaby?.birth_length || undefined,
      blood_type: currentBaby?.blood_type || "",
      current_weight: currentBaby?.current_weight || undefined,
      current_length: currentBaby?.current_length || undefined,
      head_circumference: currentBaby?.head_circumference || undefined,
      allergies: currentBaby?.allergies || [],
      medications: currentBaby?.medications || [],
      pediatrician_name: currentBaby?.pediatrician_name || "",
      pediatrician_phone: currentBaby?.pediatrician_phone || "",
      pediatrician_email: currentBaby?.pediatrician_email || "",
      emergency_contact_name: currentBaby?.emergency_contact_name || "",
      emergency_contact_relationship:
        currentBaby?.emergency_contact_relationship || "",
      emergency_contact_phone: currentBaby?.emergency_contact_phone || "",
      notes: currentBaby?.notes || "",
    },
  });

  // Reset form when currentBaby changes
  useEffect(() => {
    if (currentBaby) {
      form.reset({
        name: currentBaby.name,
        birth_date: currentBaby.birth_date,
        gender: currentBaby.gender,
        birth_weight: currentBaby.birth_weight || undefined,
        birth_length: currentBaby.birth_length || undefined,
        blood_type: currentBaby.blood_type || "",
        current_weight: currentBaby.current_weight || undefined,
        current_length: currentBaby.current_length || undefined,
        head_circumference: currentBaby.head_circumference || undefined,
        allergies: currentBaby.allergies || [],
        medications: currentBaby.medications || [],
        pediatrician_name: currentBaby.pediatrician_name || "",
        pediatrician_phone: currentBaby.pediatrician_phone || "",
        pediatrician_email: currentBaby.pediatrician_email || "",
        emergency_contact_name: currentBaby.emergency_contact_name || "",
        emergency_contact_relationship:
          currentBaby.emergency_contact_relationship || "",
        emergency_contact_phone: currentBaby.emergency_contact_phone || "",
        notes: currentBaby.notes || "",
      });
    }
  }, [currentBaby, form]);

  const onSubmit = (data: BabyFormData) => {
    if (!currentBaby?.id) return;

    updateBaby({
      babyId: currentBaby.id,
      baby: data,
    });
  };

  if (!currentBaby) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Baby className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading baby information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Baby Profile Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-pink-600" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info Display */}
                <div className="text-center p-6 bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl">
                  <div className="text-6xl mb-4">
                    {currentBaby.avatar || "👶"}
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {currentBaby.name}
                  </div>
                  <div className="text-lg text-gray-600 mb-1">
                    {calculateAge(currentBaby.birth_date)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Born: {dayjs(currentBaby.birth_date).format("MMMM D, YYYY")}
                  </div>
                </div>

                {/* Editable Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold flex items-center gap-2">
                          <Edit3 className="w-4 h-4" />
                          Baby's Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-pink-200 focus:border-pink-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birth_date"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Birth Date
                        </FormLabel>
                        <FormControl>
                          <DateTimeField
                            value={dayjs(field.value)}
                            onChange={(value) => {
                              field.onChange(value?.toISOString());
                            }}
                            ampm={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-2 md:col-span-2">
                        <FormLabel className="text-sm font-semibold">
                          Gender
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male">👶🏻 Boy</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female">👶🏻 Girl</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other">👶 Other</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Birth Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Birth Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="birth_weight"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold flex items-center gap-2">
                        <Weight className="w-4 h-4" />
                        Birth Weight (lbs)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          placeholder="e.g., 7.5"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseFloat(e.target.value)
                                : undefined
                            )
                          }
                          className="border-red-200 focus:border-red-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birth_length"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold flex items-center gap-2">
                        <Ruler className="w-4 h-4" />
                        Birth Length (inches)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          placeholder="e.g., 20.5"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseFloat(e.target.value)
                                : undefined
                            )
                          }
                          className="border-red-200 focus:border-red-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="blood_type"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold">
                        Blood Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="border-red-200 focus:border-red-400">
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Current Measurements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-blue-500" />
                  Current Measurements
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="current_weight"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold">
                        Current Weight (lbs)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          placeholder="e.g., 15.2"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseFloat(e.target.value)
                                : undefined
                            )
                          }
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="current_length"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold">
                        Current Length (inches)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          placeholder="e.g., 28.5"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseFloat(e.target.value)
                                : undefined
                            )
                          }
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="head_circumference"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold">
                        Head Circumference (inches)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          placeholder="e.g., 16.8"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseFloat(e.target.value)
                                : undefined
                            )
                          }
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-green-500" />
                  Medical Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold">
                        Allergies
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List any known allergies (e.g., milk, eggs, peanuts)"
                          value={field.value?.join(", ") || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter((s) => s)
                            )
                          }
                          className="border-green-200 focus:border-green-400"
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medications"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold">
                        Current Medications
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List any current medications or supplements"
                          value={field.value?.join(", ") || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter((s) => s)
                            )
                          }
                          className="border-green-200 focus:border-green-400"
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">
                    Pediatrician Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="pediatrician_name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-semibold">
                            Doctor's Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Dr. Smith"
                              className="border-green-200 focus:border-green-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pediatrician_phone"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-semibold">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="(555) 123-4567"
                              className="border-green-200 focus:border-green-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pediatrician_email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-semibold">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="doctor@clinic.com"
                              className="border-green-200 focus:border-green-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">
                    Emergency Contact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="emergency_contact_name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-semibold">
                            Contact Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Grandma Jane"
                              className="border-green-200 focus:border-green-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergency_contact_relationship"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-semibold">
                            Relationship
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Grandmother"
                              className="border-green-200 focus:border-green-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergency_contact_phone"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-semibold">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="(555) 987-6543"
                              className="border-green-200 focus:border-green-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-purple-500" />
                  Additional Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold">
                        General Notes
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Any additional information about your baby (preferences, habits, special needs, etc.)"
                          className="border-purple-200 focus:border-purple-400"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
              >
                <Save className="w-4 h-4" />
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Change History Modal */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              Change History for {currentBaby.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No changes recorded yet.</p>
              <p className="text-sm mt-1">
                Changes will appear here as you update {currentBaby.name}'s
                information.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BabySettingsView;
