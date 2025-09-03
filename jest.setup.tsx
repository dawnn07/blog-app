import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  unauthorized: jest.fn(),
}))

jest.mock('next/link', () => {
  return function MockedLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

jest.mock('@tanstack/react-query', () => ({
  useSuspenseInfiniteQuery: jest.fn(),
}))