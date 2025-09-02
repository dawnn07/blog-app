"use client";

import { LoadingButton } from "@/components/loading-button";
import { useCallback, useRef, useTransition } from "react";
import { toast } from "sonner";
import { createPost } from "./actions";
import TiptapEditor from "@/components/tiptap-editor";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const createPostSchema = z.object({
  title: z.string().min(2).max(100),
  excerpt: z.string().max(200).optional(),
  content: z.string().min(10).max(50000),
});

export type CreatePostValues = z.infer<typeof createPostSchema>;

export function CreatePostForm() {
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<CreatePostValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
    },
  });

    const handleContentChange = useCallback((content: string) => {

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const textContent = content.replace(/<[^>]+>/g, '').slice(0, 200);
      const autoExcerpt = textContent.length > 150
        ? textContent.substring(0, 150) + '...'
        : textContent;

      const currentExcerpt = form.getValues("excerpt");
      if (currentExcerpt !== autoExcerpt) {
        form.setValue("excerpt", autoExcerpt, { shouldValidate: false });
      }
    }, 300); 
  }, [form]);

   async function onSubmit(data: CreatePostValues) {
    startTransition(async () => {
      try {
        const result = await createPost(data);
        console.log("Post created:", result);
        if (result?.data.isSuccess) {
          toast.success("Post created successfully");
          form.reset();
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    });
  }


  return (
    <div className="w-full">
      <div className="border-accent/20 bg-accent/5 rounded-lg border p-4">
        <div className="space-y-3">
          <div>
            <h2 className="text-accent font-medium">Create Post</h2>
            <p className="text-muted-foreground text-sm">
              This action will create a new post. This cannot be undone.
            </p>
          </div>
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Post Title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Post Excerpt"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <TiptapEditor
                        {...field}
                        onChange={(value: string) => {
                          field.onChange(value);
                          handleContentChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton
                loading={isPending}
                type="submit"
                variant="default"
                className="w-full"
              >
                Create Post
              </LoadingButton>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
