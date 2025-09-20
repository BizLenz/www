"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { router } from "next/client";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { useState } from "react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { toast } from "sonner";

const formSchema = z.object({
  category: z.string({
    required_error: "Please select a category.",
  }),
  files: z.any().optional(), // Placeholder for file DND
});

export function DashboardFileForm({}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
    },
  });

  const [files, setFiles] = useState<File[]>([]);
  const { uploadFile, loading, error, reset } = useFileUpload({
    description: "User uploaded document",
  });
  const router = useRouter();

  const handleDrop = (files: File[]) => {
    console.log("Accepted files:", files);
    setFiles(files);
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Form submitted with data:", data);
    try {
      if (files.length === 0) {
        toast.error("No file selected.");
        return;
      }
      const file = files[0];
      if (!file) {
        toast.error("No file selected.");
        return;
      }
      const result = await uploadFile(file);
      if (result) {
        console.log("File uploaded successfully:", result);
        toast.success("File uploaded successfully.");
        setFiles([]);
        // TODO: make analysis-result call to backend
        router.push(`/files`);
      }
    } catch (error) {
      console.error("File upload failed:", error);
    }
  }

  return (
    <div className="rounded-xl border-1 p-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Title and Subheading */}
          <div>
            <h2 className="text-2xl font-bold">새 분석 시작하기</h2>
            <p className="text-muted-foreground">
              새로운 파일을 추가하거나, 기존 파일로 분석을 시작하세요
            </p>
          </div>

          {/* Row with Select Component */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row gap-4">
                  <FormLabel>분석 종류</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="종류를 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="default">기본 분석</SelectItem>
                      <SelectItem value="deep">심층 분석</SelectItem>
                      <SelectItem value="visual">시각화</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Dropzone
            accept={{ "application/pdf": [] }}
            onDrop={handleDrop}
            onError={console.error}
            src={files}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>

          {/* Button */}
          <div className="flex justify-end">
            <Button type="submit">분석 시작</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
