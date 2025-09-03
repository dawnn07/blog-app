import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { PostList } from './post-list'
import { Wrapper } from '@/jest/wrapper'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Post } from '@/types'

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useSuspenseInfiniteQuery: jest.fn()
}))

jest.mock('./post-card', () => ({
  PostCard: ({ post }: { post: Post }) => (
    <div data-testid={`post-card-${post.id}`}>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <span>By: {post.author.name}</span>
      <span>Comments: {post._count.comments}</span>
    </div>
  )
}))


jest.mock('@/queries/post-queries', () => ({
  postsInfiniteOptions: jest.fn(() => ({}))
}))

const mockPosts = [
  {
    id: '1',
    title: 'Post 1',
    content: 'Content for post 1',
    excerpt: 'Excerpt for post 1',
    createdAt: '2023-01-01',
    author: {
      name: 'Author 1',
      email: 'author1@example.com',
    },
    _count: {
      comments: 5,
    },
  },
  {
    id: '2',
    title: 'Post 2',
    content: 'Content for post 2',
    excerpt: 'Excerpt for post 2',
    createdAt: '2023-01-02',
    author: {
      name: 'Author 2',
      email: 'author2@example.com',
    },
    _count: {
      comments: 3,
    },
  },
  {
    id: '3',
    title: 'Post 3',
    content: 'Content for post 3',
    excerpt: 'Excerpt for post 3',
    createdAt: '2023-01-03',
    author: {
      name: 'Author 3',
      email: 'author3@example.com',
    },
    _count: {
      comments: 8,
    },
  },
]

const mockSearchParams = {
  get: jest.fn((key) => {
    if (key === 'q') return ''
    if (key === 'sort') return 'desc'
    return null
  })
}

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => mockSearchParams),
}))

describe('PostList', () => {
  it('renders posts successfully', () => {
    // Mock useSuspenseInfiniteQuery directly
    (useSuspenseInfiniteQuery as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            data: {
              data: mockPosts
            }
          }
        ],
        pageParams: [undefined]
      },
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      status: 'success'
    })

    render(
      <Wrapper>
        <PostList />
      </Wrapper>
    )

    // Assert that all posts are rendered
    expect(screen.getByTestId('post-card-1')).toBeInTheDocument()
    expect(screen.getByTestId('post-card-2')).toBeInTheDocument()
    expect(screen.getByTestId('post-card-3')).toBeInTheDocument()

    // Assert that post content is displayed
    expect(screen.getByText('Post 1')).toBeInTheDocument()
    expect(screen.getByText('Post 2')).toBeInTheDocument()
    expect(screen.getByText('Post 3')).toBeInTheDocument()

    expect(screen.getByText('Excerpt for post 1')).toBeInTheDocument()
    expect(screen.getByText('By: Author 1')).toBeInTheDocument()
    expect(screen.getByText('Comments: 5')).toBeInTheDocument()
  })
})