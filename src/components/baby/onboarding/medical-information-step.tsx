import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input, Badge } from "components/ui";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "components/ui/form";
import { X } from "lucide-react";

// Local ArrayInputWithBadges component matching the onboarding-quiz design
const ArrayInputWithBadges = ({
  value,
  onChange,
  placeholder,
}: {
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  placeholder: string;
}) => {
  const [inputValue, setInputValue] = useState("");

  const safeValue = value ?? [];

  const tryCommit = () => {
    const v = inputValue.trim();
    if (!v) return;
    if (!safeValue.includes(v)) onChange([...safeValue, v]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      tryCommit();
    }
  };

  const handleBlur = () => {
    tryCommit();
  };

  const removeItem = (item: string) => {
    onChange(safeValue.filter((i) => i !== item));
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
      {safeValue.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {safeValue.map((item, idx) => (
            <Badge
              key={`${item}-${idx}`}
              variant="secondary"
              className="bg-green-100 text-green-700 flex items-center gap-1"
            >
              {item}
              <button
                type="button"
                onClick={() => removeItem(item)}
                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                aria-label={`Remove ${item}`}
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

const MedicalInformationStep = () => {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <FormField
            control={control}
            name="allergies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Known Allergies</FormLabel>
                <FormControl>
                  <ArrayInputWithBadges
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Type an allergy and press Enter"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={control}
            name="medications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Medications</FormLabel>
                <FormControl>
                  <ArrayInputWithBadges
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Type a medication and press Enter"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">
            Pediatrician Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormField
                control={control}
                name="pediatrician_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor's Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Dr. Smith"
                        {...field}
                        className="border-green-200 focus:border-green-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={control}
                name="pediatrician_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(555) 123-4567"
                        {...field}
                        className="border-green-200 focus:border-green-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={control}
                name="pediatrician_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="dr.smith@example.com"
                        {...field}
                        className="border-green-200 focus:border-green-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Emergency Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormField
                control={control}
                name="emergency_contact_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Grandma Jane"
                        {...field}
                        className="border-green-200 focus:border-green-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={control}
                name="emergency_contact_relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Father"
                        {...field}
                        className="border-green-200 focus:border-green-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={control}
                name="emergency_contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(555) 987-6543"
                        {...field}
                        className="border-green-200 focus:border-green-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalInformationStep;
