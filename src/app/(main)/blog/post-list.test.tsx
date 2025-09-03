import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { PostList } from './post-list'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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

jest.mock('@/queries/post-queries', () => ({
  postsInfiniteOptions: jest.fn(() => ({
    queryKey: ['posts'],
    queryFn: () => Promise.resolve({
      pages: [{
        data: {
          data: []
        }
      }]
    }),
    getNextPageParam: () => undefined,
  }))
}))

jest.mock('./post-card', () => ({
  PostCard: jest.fn(({ post }) => <div data-testid="post-card">{post.title}</div>)
}))

describe('PostList Component', () => {
  let queryClient : QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    
    // Reset mocks
    jest.clearAllMocks()
  })

  it('should render correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostList />
      </QueryClientProvider>
    )
  })

  it('should render "No posts found" when there are no posts', () => {
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <PostList />
      </QueryClientProvider>
    )
    
    expect(getByText('No posts found')).toBeInTheDocument()
    expect(getByText('There are no posts to display at the moment.')).toBeInTheDocument()
  })

  it('should use search params correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostList />
      </QueryClientProvider>
    )
    
    expect(mockSearchParams.get).toHaveBeenCalledWith('q')
    expect(mockSearchParams.get).toHaveBeenCalledWith('sort')
  })
})