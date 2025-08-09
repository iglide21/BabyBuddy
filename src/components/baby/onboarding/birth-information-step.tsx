import { useFormContext } from "react-hook-form";
import {
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "components/ui";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "components/ui/form";

const BirthInformationStep = () => {
  const form = useFormContext();

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="birth_weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Birth Weight (kg)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 7.5"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      field.onChange(v === "" ? null : Number.parseFloat(v));
                    }}
                    className="border-red-200 focus:border-red-400"
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
            name="birth_length"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Birth Length (cm)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 20.5"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      field.onChange(v === "" ? null : Number.parseFloat(v));
                    }}
                    className="border-red-200 focus:border-red-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <FormField
          control={form.control}
          name="blood_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Type</FormLabel>
              <Select
                value={(field.value as string) ?? ""}
                onValueChange={field.onChange}
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
      </div>
    </div>
  );
};

export default BirthInformationStep;
