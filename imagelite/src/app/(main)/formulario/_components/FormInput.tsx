import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import RequiredText from "./RequiredText"

interface FormInputProps {
  id: string
  label: string
  placeholder: string
  register: object
  error?: string
  required?: boolean
}

export default function FormInput({ id, label, placeholder, register, error, required }: FormInputProps) {
  return (
    <div className="flex flex-col">
      <Label htmlFor={id} className="mb-2 flex items-center gap-0.5">
        {label}: {required && <RequiredText />}
      </Label>
      <Input
        placeholder={placeholder}
        type="text"
        id={id}
        {...register}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}