import axiosClient from "@/lib/axios-client";
import { PaginationApiResponse, Post, PostsQueryParams } from "@/types";

export function getPosts(params: PostsQueryParams = {}) {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    const queryString = searchParams.toString();
    const url = queryString ? `/posts?${queryString}` : '/posts';

    return axiosClient.get<PaginationApiResponse<Post[]>>(url);
}

export function getPostById(id: string) {
    return axiosClient.get<Post>(`/posts/${id}`);
}