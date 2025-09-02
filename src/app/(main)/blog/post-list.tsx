"use client"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { PostCard } from "./post-card"
import { postsInfiniteOptions } from "@/queries/post-queries"
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";


export function PostList() {

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const sortOrderParam = searchParams.get('sort');
  const sortOrder: 'asc' | 'desc' = sortOrderParam === 'asc' ? 'asc' : 'desc';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useSuspenseInfiniteQuery(
    postsInfiniteOptions({
      limit: 5,
      search: searchQuery || undefined,
      sortOrder: sortOrder,
    })
  );


  const allPosts = useMemo(() => {
    return data?.pages?.flatMap(page => page.data.data) || [];
  }, [data]);


  if (allPosts.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No posts found
        </h3>
        <p className="text-sm text-muted-foreground">
          There are no posts to display at the moment.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {allPosts.map((post, index) => (
          <div
            key={post.id}
            className="animate-in slide-in-from-bottom-4 duration-300"
            style={{
              animationDelay: `${(index % 5) * 50}ms`,
              animationFillMode: 'backwards'
            }}
          >
            <PostCard post={post} />
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
      {!hasNextPage && allPosts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            {`You've reached the end of the posts`}
          </p>
        </div>
      )}
    </div>
  )
}

