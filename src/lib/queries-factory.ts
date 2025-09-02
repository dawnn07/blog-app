import { CommentsQueryParams, PostsQueryParams } from "@/types";

export const queriesFactory = {
   posts: (queryType: PostsQueryParams) => ["posts", { queryType }],
   postsSearch: (queryType: PostsQueryParams) => ["posts-search", { queryType }],
   postDetail: (id: string) => ["posts", { id }],
   comments: (id: string, queryType: CommentsQueryParams) => ["comments", { id, queryType }],
}