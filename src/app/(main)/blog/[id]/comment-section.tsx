"use client"
import { LoadingButton } from "@/components/loading-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { createComment } from "./actions";
import { toast } from "sonner";
import { useQueryClient, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { commentsInfiniteOptions } from "@/queries/comment-queries";
import { Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";
import { Comment } from "@/types";

const createCommentSchema = z.object({
    comment: z.string().min(2).max(10000),
});

export type CreateCommentValues = z.infer<typeof createCommentSchema>;

export function CommentSection({ id }: { id: string }) {

    const [isPending, startTransition] = useTransition();
    const queryClient = useQueryClient();

    const form = useForm<CreateCommentValues>({
        resolver: zodResolver(createCommentSchema),
        defaultValues: {
            comment: "",
        },
    });

    async function onSubmit(data: CreateCommentValues) {
        startTransition(async () => {
            try {
                const response = await createComment(id, data.comment);
                console.log(response);
                if (response?.data.isSuccess) {
                    toast.success("Comment created successfully!");
                    form.reset();
                    queryClient.invalidateQueries(commentsInfiniteOptions(id, { limit: 5 }));
                }
            } catch (error) {
                console.error("Error creating comment:", error);
                toast.error("Failed to create comment. Please try again.");
            }
        });
    }

    return (
        <div className="space-y-6">
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-4 flex md:flex-row flex-col items-start">
                    <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Comment something..."
                                        {...field}
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
                        className="w-fit md:mt-6 mt-2"
                    >
                        Comment
                    </LoadingButton>
                </form>
            </Form>
            <Suspense fallback={<CommentsLoading />}>
                <CommentList postId={id} />
            </Suspense>
        </div>
    );
}
function CommentsLoading() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-muted rounded"></div>
                        <div className="w-20 h-3 bg-muted rounded"></div>
                        <div className="w-2 h-2 bg-muted rounded-full"></div>
                        <div className="w-16 h-3 bg-muted rounded"></div>
                    </div>
                    <div className="w-full h-16 bg-muted rounded mb-4"></div>
                </div>
            ))}
        </div>
    );
}


function CommentItem({ comment }: { comment: Comment }) {
    return (
        <div className="flex-1 min-w-0">
            {/* Comment header */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                    <User size={12} />
                    <span className="font-medium hover:underline cursor-pointer">
                        u/{comment.author.name}
                    </span>
                </div>
                <span>•</span>
                <span>{formatRelativeTime(comment.createdAt)}</span>
            </div>

            {/* Comment text */}
            <div className="text-sm text-foreground mb-2 leading-relaxed break-words">
                {comment.content}
            </div>
        </div>
    )
}

function CommentList({ postId }: { postId: string }) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useSuspenseInfiniteQuery(
        commentsInfiniteOptions(postId, {
            limit: 5
        })
    );


    const allComments = useMemo(() => {
        return data?.pages?.flatMap(page => page.data.data) || [];
    }, [data]);


    if (allComments.length === 0 && !isLoading) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No comments found
                </h3>
                <p className="text-sm text-muted-foreground">
                    There are no comments to display at the moment.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                {allComments.map((comment, index) => (
                    <div key={comment.id}>
                        <CommentItem comment={comment} />
                        {index < allComments.length - 1 && (
                            <div className="border-b border-border ml-8" />
                        )}
                    </div>
                ))}
            </div>
            {
                hasNextPage && (
                    <div className="flex justify-center py-8">
                        <Button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            variant="outline"
                            className="min-w-32"
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Loading...
                                </>
                            ) : (
                                'Load More Posts'
                            )}
                        </Button>
                    </div>
                )
            }
            {!hasNextPage && allComments.length > 0 && (
                <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                        {`You've reached the end of the comments`}
                    </p>
                </div>
            )}
        </div>
    );
}