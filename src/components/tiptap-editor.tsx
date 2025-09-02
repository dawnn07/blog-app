"use client";

import { EditorContent, Extension, useEditor } from "@tiptap/react";
import EditorToolbar from "./toolbars";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "@/lib/utils";

const extensions = [
    StarterKit.configure({
        orderedList: {
            HTMLAttributes: {
                class: "list-decimal pl-4",
            },
        },
        blockquote: {
            HTMLAttributes: {
                class: "border-l-2 border-accent pl-4",
            },
        },
        bulletList: {
            HTMLAttributes: {
                class: "list-disc pl-4",
            },
        },
        code: {
            HTMLAttributes: {
                class: "bg-accent rounded-md p-1",
            },
        },
        horizontalRule: {
            HTMLAttributes: {
                class: "my-2",
            },
        },
        codeBlock: {
            HTMLAttributes: {
                class: "bg-primary text-primary-foreground p-2 text-sm rounded-md p-1",
            },
        },
        heading: {
            levels: [1, 2, 3, 4],
            HTMLAttributes: {
                class: "tiptap-heading",
            },
        },
    }),
];

interface TiptapEditorProps {
    content?: string
    onChange?: (content: string) => void
    editable?: boolean
    className?: string
}

const TiptapEditor = ({
    content = '',
    onChange,
    editable = true,
    className,
}: TiptapEditorProps) => {

    const editor = useEditor({
        extensions: extensions as Extension[],
        content,
        editable,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
                    'prose-headings:font-bold prose-headings:text-foreground',
                    'prose-p:text-foreground prose-p:leading-relaxed',
                    'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
                    'prose-strong:text-foreground prose-em:text-foreground',
                    'prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
                    'prose-pre:bg-muted prose-pre:border prose-pre:border-border',
                    'prose-blockquote:border-l-primary prose-blockquote:text-foreground',
                    'prose-ul:text-foreground prose-ol:text-foreground',
                    'prose-li:text-foreground',
                    'min-h-[200px] p-4',
                    className
                ),
            },
        },
    });

    if (!editor) {
        return null;
    }
    return (
        <div className="border w-full relative rounded-md overflow-hidden pb-3">
            <div className="flex w-full items-center py-2 px-2 justify-between border-b  sticky top-0 left-0 bg-background z-20">
                <EditorToolbar editor={editor} />
            </div>
            <div
                onClick={() => {
                    editor?.chain().focus().run();
                }}
                className="cursor-text min-h-[18rem] bg-background"
            >
                <EditorContent className="outline-none" editor={editor} />
            </div>
        </div>
    );
};

export default TiptapEditor;