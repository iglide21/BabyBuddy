import { useBabyFromUrl } from "@/src/hooks";
import { Label, Textarea, Separator, Input, Button, Badge } from "../../ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import type { UpdateBaby } from "@/types/data/babies/types";
import { X } from "lucide-react";

const medicalInformationSchema = z.object({
  allergies: z.array(z.string()).optional().nullable(),
  medications: z.array(z.string()).optional().nullable(),
  pediatrician_name: z.string().optional().nullable(),
  pediatrician_phone: z.string().optional().nullable(),
  pediatrician_email: z
    .string()
    .email("Invalid email format")
    .optional()
    .nullable(),
  emergency_contact_name: z.string().optional().nullable(),
  emergency_contact_relationship: z.string().optional().nullable(),
  emergency_contact_phone: z.string().optional().nullable(),
});

type MedicalInformationFormData = z.infer<typeof medicalInformationSchema>;

interface ArrayInputWithBadgesProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  label: string;
}

const ArrayInputWithBadges = ({
  value,
  onChange,
  placeholder,
  label,
}: ArrayInputWithBadgesProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newItem = inputValue.trim();
      if (!value.includes(newItem)) {
        onChange([...value, newItem]);
      }
      setInputValue("");
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      const newItem = inputValue.trim();
      if (!value.includes(newItem)) {
        onChange([...value, newItem]);
      }
      setInputValue("");
    }
  };

  const removeItem = (itemToRemove: string) => {
    onChange(value.filter((item) => item !== itemToRemove));
  };

  return (
    <div className="space-y-3">
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="border-green-200 focus:border-green-400"
      />
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-green-100 text-green-700 flex items-center gap-1"
            >
              {item}
              <button
                type="button"
                onClick={() => removeItem(item)}
                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

interface EditMedicalInformationSectionProps {
  onSubmit: (data: Partial<UpdateBaby>) => void;
  isSavePending: boolean;
}

const EditMedicalInformationSection = ({
  onSubmit,
  isSavePending,
}: EditMedicalInformationSectionProps) => {
  const { currentBaby } = useBabyFromUrl();

  const form = useForm<MedicalInformationFormData>({
    resolver: zodResolver(medicalInformationSchema),
    defaultValues: {
      allergies: currentBaby?.allergies || [],
      medications: currentBaby?.medications || [],
      pediatrician_name: currentBaby?.pediatrician_name || "",
      pediatrician_phone: currentBaby?.pediatrician_phone || "",
      pediatrician_email: currentBaby?.pediatrician_email || "",
      emergency_contact_name: currentBaby?.emergency_contact_name || "",
      emergency_contact_relationship:
        currentBaby?.emergency_contact_relationship || "",
      emergency_contact_phone: currentBaby?.emergency_contact_phone || "",
    },
  });

  // Update form values when currentBaby changes
  useEffect(() => {
    if (currentBaby) {
      form.reset({
        allergies: currentBaby.allergies || [],
        medications: currentBaby.medications || [],
        pediatrician_name: currentBaby.pediatrician_name || "",
        pediatrician_phone: currentBaby.pediatrician_phone || "",
        pediatrician_email: currentBaby.pediatrician_email || "",
        emergency_contact_name: currentBaby.emergency_contact_name || "",
        emergency_contact_relationship:
          currentBaby.emergency_contact_relationship || "",
        emergency_contact_phone: currentBaby.emergency_contact_phone || "",
      });
    }
  }, [currentBaby, form]);

  const handleSubmit = (data: MedicalInformationFormData) => {
    const changedData: Partial<UpdateBaby> = {};

    if (
      JSON.stringify(data.allergies) !== JSON.stringify(currentBaby?.allergies)
    ) {
      changedData.allergies = data.allergies;
    }
    if (
      JSON.stringify(data.medications) !==
      JSON.stringify(currentBaby?.medications)
    ) {
      changedData.medications = data.medications;
    }
    if (data.pediatrician_name !== currentBaby?.pediatrician_name) {
      changedData.pediatrician_name = data.pediatrician_name;
    }
    if (data.pediatrician_phone !== currentBaby?.pediatrician_phone) {
      changedData.pediatrician_phone = data.pediatrician_phone;
    }
    if (data.pediatrician_email !== currentBaby?.pediatrician_email) {
      changedData.pediatrician_email = data.pediatrician_email;
    }
    if (data.emergency_contact_name !== currentBaby?.emergency_contact_name) {
      changedData.emergency_contact_name = data.emergency_contact_name;
    }
    if (
      data.emergency_contact_relationship !==
      currentBaby?.emergency_contact_relationship
    ) {
      changedData.emergency_contact_relationship =
        data.emergency_contact_relationship;
    }
    if (data.emergency_contact_phone !== currentBaby?.emergency_contact_phone) {
      changedData.emergency_contact_phone = data.emergency_contact_phone;
    }

    if (Object.keys(changedData).length > 0) {
      onSubmit(changedData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="allergies"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Allergies
                </FormLabel>
                <FormControl>
                  <ArrayInputWithBadges
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Type an allergy and press Enter (e.g., milk, eggs, peanuts)"
                    label="Allergies"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="medications"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Current Medications
                </FormLabel>
                <FormControl>
                  <ArrayInputWithBadges
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Type a medication and press Enter (e.g., vitamin D, iron supplement)"
                    label="Medications"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Doctor's Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Dr. Smith"
                      value={field.value || ""}
                      onChange={field.onChange}
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
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(555) 123-4567"
                      value={field.value || ""}
                      onChange={field.onChange}
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
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="doctor@clinic.com"
                      value={field.value || ""}
                      onChange={field.onChange}
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
          <h4 className="font-semibold text-gray-800">Emergency Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="emergency_contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Contact Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Grandma Jane"
                      value={field.value || ""}
                      onChange={field.onChange}
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
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Relationship
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Grandmother"
                      value={field.value || ""}
                      onChange={field.onChange}
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
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(555) 987-6543"
                      value={field.value || ""}
                      onChange={field.onChange}
                      className="border-green-200 focus:border-green-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            {isSavePending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditMedicalInformationSection;
