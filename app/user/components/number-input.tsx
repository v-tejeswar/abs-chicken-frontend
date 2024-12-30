"use client";

import { Input } from "@/components/ui/input";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { useController } from "react-hook-form";

interface NumberInputProps {
  label: string;
  name: string;
  control: any;
  min?: number;
}

export function NumberInput({ label, name, control, min = 0 }: NumberInputProps) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { min: { value: min, message: `Value must be at least ${min}` } },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= min) {
      field.onChange(value);
    }
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          type="number"
          min={min}
          value={field.value ?? ""}
          onChange={handleChange}
        />
      </FormControl>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </FormItem>
  );
}
