import { queriesFactory } from "@/lib/queries-factory";
import { getComments } from "@/services/comment";
import { CommentsQueryParams } from "@/types";
import { infiniteQueryOptions } from "@tanstack/react-query";

export const commentsInfiniteOptions = (postId: string, queryType: CommentsQueryParams) => {
  return infiniteQueryOptions({
    queryKey: queriesFactory.comments(postId, queryType),
    queryFn: ({ pageParam }) => getComments(postId, { ...queryType, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const { pagination } = lastPage.data;
      return lastPageParam < pagination.totalPages ? lastPageParam + 1 : undefined;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      return firstPageParam > 1 ? firstPageParam - 1 : undefined;
    },
  })
}