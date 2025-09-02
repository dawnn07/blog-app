import axiosClient from "@/lib/axios-client";
import { PaginationApiResponse, Comment, CommentsQueryParams } from "@/types";

export function getComments(postId: string, params: CommentsQueryParams = {}) {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    const url = queryString ? `/posts/${postId}/comments?${queryString}` : `/posts/${postId}/comments`;

    return axiosClient.get<PaginationApiResponse<Comment[]>>(url);
}
