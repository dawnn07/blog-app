export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
}

export interface PaginationApiResponse<T> {
  data: T;
  pagination: PostsPagination;
  isSuccess: boolean;
}

export interface Author {
  id: string;
  name: string | null;
  email: string;
}

export interface Post {
  id: string
  title: string
  content: string
  excerpt?: string
  createdAt: string
  author: {
    name: string
    email: string
  }
  _count: {
    comments: number
  }
}

export interface PostsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}


export interface PostsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'title' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  postId: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CommentsQueryParams {
  page?: number;
  limit?: number;
}