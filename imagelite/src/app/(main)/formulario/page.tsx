"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FormInput from "./_components/FormInput";
import FileUpload from "./_components/FileUpload";
import TagInput from "./_components/TagInput";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { useImageService } from "@/resources";
import { useRouter } from 'next/navigation';


const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  tags: z.array(z.string()).min(2, { message: "At least 2 tags are required" }),
  image: z.instanceof(File, { message: "Image is required" }),
});

type FormData = z.infer<typeof formSchema>;

export default function Formulario() {
  const [tags, setTags] = useState<string[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      tags: [],
      image: undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("tags", data.tags.join(","));
    formData.append("file", data.image);

    await useImageService.sendImage(formData);

    toast({
      title: "🖼️ Image uploaded",
      description: "Your image has been uploaded successfully",
    });

    setTags([]);
    handleFileChange(null);
    reset();

    setTimeout(() => {
      router.push('/galeria');
    }, 1500);
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    setValue("tags", newTags);
    trigger("tags");
  };

  const handleFileChange = (file: File | null) => {
    setValue("image", file as File);
    trigger("image");
  };

  return (
    <section className="flex flex-col items-center justify-center my-5">
      <h5 className="mt-3 mb-10 text-3xl font-extrabold tracking-tight text-gray-900">
        New image
      </h5>
      <form className="space-y-4 w-2/3" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          id="name"
          label="Name"
          placeholder="Name of the image"
          register={register("name")}
          error={errors.name?.message}
          required
        />
        <TagInput
          label="Tags"
          tags={tags}
          setTags={handleTagsChange}
          error={errors.tags?.message}
          required
        />
        <FileUpload
          label="Image"
          setFile={handleFileChange}
          error={errors.image?.message}
          required
        />
        <div className="flex justify-between">
          <Link href="/galeria">
            <Button type="button" size={"sm"} className="bg-red-500 text-white hover:bg-red-600">
              Cancel
            </Button>
          </Link>
          <Button type="submit" size={"sm"} className="bg-primary text-white">
            Submit
          </Button>
        </div>
      </form>
    </section>
  );
}
