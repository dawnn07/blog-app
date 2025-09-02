"use client"
import { formatDate } from "@/lib/utils";
import { postDetailOptions } from "@/queries/post-queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, User } from "lucide-react";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "./comment-section";

export function PostDetail({ id }: { id: string }) {
    const { data } = useSuspenseQuery(postDetailOptions(id))
    const postData = data.data

    function parseContentHtml(content: string) {
        const root = unified().use(rehypeParse, { fragment: true }).parse(content);
        const parsedContent = unified().use(rehypeStringify).stringify(root);
        return parsedContent;
    }

    return (
        <div className="flex-1 w-full">
            <article className="space-y-4 sm:space-y-6">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">r/blog</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">Posted by</span>
                    <div className="flex items-center gap-1">
                        <User size={12} className="sm:size-4" />
                        <span className="hover:underline cursor-pointer break-all sm:break-normal">
                            u/{postData.author.name}
                        </span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                        <Calendar size={12} className="sm:size-4" />
                        <span className="whitespace-nowrap">
                            {formatDate(new Date(postData.createdAt))}
                        </span>
                    </div>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight break-words">
                    {postData.title}
                </h1>

                <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-foreground">
                    <div
                        dangerouslySetInnerHTML={{ __html: parseContentHtml(postData.content) }}
                        className="break-words overflow-wrap-anywhere hyphens-auto [word-break:break-word] [&>*]:mb-3 [&>*]:sm:mb-4 [&>p]:text-sm [&>p]:sm:text-base [&>p]:leading-relaxed [&>h1]:text-lg [&>h1]:sm:text-xl [&>h1]:lg:text-2xl [&>h1]:font-semibold [&>h1]:mb-4 [&>h2]:text-base [&>h2]:sm:text-lg [&>h2]:lg:text-xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h3]:text-sm [&>h3]:sm:text-base [&>h3]:lg:text-lg [&>h3]:font-semibold [&>h3]:mb-2 [&>ul]:text-sm [&>ul]:sm:text-base [&>ul]:pl-4 [&>ul]:sm:pl-6 [&>ol]:text-sm [&>ol]:sm:text-base [&>ol]:pl-4 [&>ol]:sm:pl-6 [&>li]:mb-1 [&>blockquote]:border-l-2 [&>blockquote]:sm:border-l-4 [&>blockquote]:border-muted [&>blockquote]:pl-3 [&>blockquote]:sm:pl-6 [&>blockquote]:text-muted-foreground [&>blockquote]:italic [&>pre]:p-3 [&>pre]:sm:p-4 [&>pre]:rounded [&>pre]:text-xs [&>pre]:sm:text-sm [&>pre]:overflow-x-auto [&>code]:px-1 [&>code]:sm:px-2 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs [&>code]:sm:text-sm [&>img]:rounded-lg [&>img]:max-w-full [&>img]:h-auto [&>table]:w-full [&>table]:text-sm [&>table]:sm:text-base [&>thead]:border-b [&>th]:p-2 [&>th]:sm:p-3 [&>th]:text-left [&>td]:p-2 [&>td]:sm:p-3 [&>td]:border-b"
                    />
                </div>
            </article>

            <Separator className="my-6 sm:my-8 lg:my-12" />

            <CommentSection id={id} />
        </div>
    )
}