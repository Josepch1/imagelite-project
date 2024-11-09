import { useState, KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import RequiredText from "./RequiredText"

interface TagInputProps {
  label: string
  tags: string[]
  setTags: (tags: string[]) => void
  error?: string
  required?: boolean
}

export default function TagInput({ label, tags, setTags, error, required }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  const addTag = () => {
    const trimmedInput = inputValue.trim()
    if (trimmedInput && !tags.includes(trimmedInput)) {
      setTags([...tags, trimmedInput])
      setInputValue("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="flex flex-col">
      <Label htmlFor="tags" className="mb-2 flex items-center gap-0.5">
        {label}: {required && <RequiredText />}
      </Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="text-sm py-1 px-2">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-destructive focus:outline-none"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove tag</span>
            </button>
          </Badge>
        ))}
      </div>
      <Input
        id="tags"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onBlur={addTag}
        placeholder="Enter tags (press Enter or comma to add)"
        className="mt-1"
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}