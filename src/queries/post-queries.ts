import { queriesFactory } from "@/lib/queries-factory"
import { getPostById, getPosts } from "@/services/post"
import { PostsQueryParams } from "@/types"
import { infiniteQueryOptions } from "@tanstack/react-query"


export const postsInfiniteOptions = (queryType: PostsQueryParams) => {
  return infiniteQueryOptions({
    queryKey: queriesFactory.posts(queryType),
    queryFn: ({ pageParam }) => getPosts({ ...queryType, page: pageParam }),
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

export const postsSearchInfiniteOptions = (queryType: PostsQueryParams) => {
  return infiniteQueryOptions({
    queryKey: queriesFactory.postsSearch(queryType),
    queryFn: ({ pageParam }) => getPosts({ ...queryType, page: pageParam }),
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
export const postDetailOptions = (id: string) => {
  return {
    queryKey: queriesFactory.postDetail(id),
    queryFn: () => getPostById(id),
    enabled: !!id,
  }
}