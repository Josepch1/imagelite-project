import { useState, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import RequiredText from "./RequiredText"

interface FileUploadProps {
  label: string
  setFile: (file: File | null) => void
  error?: string
  required?: boolean
}

export default function FileUpload({ label, setFile, error, required }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0])
    }
  }

  const handleFileChange = (file: File) => {
    setSelectedFile(file)
    setFile(file)
  }

  const onFileUploadAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedFile(null)
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col">
      <Label htmlFor="image" className="mb-2 flex items-center gap-0.5">
        {label}: {required && <RequiredText />}
      </Label>
      <div
        className={`p-8 text-center border-2 border-dashed rounded-lg cursor-pointer relative ${
          dragActive ? "border-primary" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onFileUploadAreaClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept="image/*"
        />
        {selectedFile ? (
          <>
            <p className="text-sm text-gray-500">{selectedFile.name}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 hover:bg-red-300"
              onClick={clearFile}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear file</span>
            </Button>
          </>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Drag and drop your image here, or click to select a file
            </p>
          </>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}