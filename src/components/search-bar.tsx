"use client"
import { postsInfiniteOptions, postsSearchInfiniteOptions } from "@/queries/post-queries"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query" 
import { Calendar, ChevronRight, FileText, Loader2, Search, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState, Suspense } from "react"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { formatRelativeTime } from "@/lib/utils"
import { debounce } from "lodash"

function SearchResultsLoading() {
    return (
        <div className="max-h-80 overflow-y-auto">
            <div className="p-3 border-b bg-muted/10">
                <div className="animate-pulse">
                    <div className="h-3 bg-muted rounded w-24"></div>
                </div>
            </div>
            
            <div className="divide-y">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-3 animate-pulse">
                        <div className="flex items-start gap-3">
                            <div className="w-4 h-4 bg-muted rounded mt-1"></div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 bg-muted rounded w-12"></div>
                                    <div className="h-3 bg-muted rounded w-20"></div>
                                </div>
                                <div className="h-4 bg-muted rounded w-full"></div>
                                <div className="h-3 bg-muted rounded w-3/4"></div>
                                <div className="h-3 bg-muted rounded w-16"></div>
                            </div>
                            <div className="w-4 h-4 bg-muted rounded mt-1"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function SearchResults({ debouncedQuery, onResultClick }: { 
    debouncedQuery: string, 
    onResultClick: () => void 
}) {
    const {
        data,
    } = useSuspenseInfiniteQuery(
        postsSearchInfiniteOptions({
            limit: 5,
            search: debouncedQuery,
        })
    );

    const total = data?.pages?.[0]?.data?.pagination?.total || 0
    const searchData = useMemo(() => {
        if (!data) return []
        return data.pages.flatMap(page => page.data.data)
    }, [data])

    const getResultIcon = (type: string) => {
        switch (type) {
            case 'post': return <FileText className="w-4 h-4" />
            default: return <Search className="w-4 h-4" />
        }
    }

    if (searchData.length === 0) {
        return (
            <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                    {`No results found for "${debouncedQuery}"`}
                </p>
            </div>
        )
    }

    return (
        <div className="max-h-80 overflow-y-auto">
            <div className="p-3 border-b bg-muted/10">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{total} results found</span>
                </div>
            </div>

            <div className="divide-y">
                {searchData.map((result) => (
                    <Link
                        key={result.id}
                        href={`/blog/${result.id}`}
                        onClick={onResultClick}
                        className="block p-3 hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-muted-foreground">
                                {getResultIcon("post")}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="secondary" className="text-xs capitalize">
                                        post
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        by {result.author.name}
                                    </span>
                                </div>

                                <h4 className="text-sm font-medium truncate">
                                    {result.title}
                                </h4>

                                <p className="text-xs text-muted-foreground truncate mt-1">
                                    {result.excerpt || result.content.substring(0, 100)}
                                </p>

                                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatRelativeTime(result.createdAt)}</span>
                                </div>
                            </div>

                            <ChevronRight className="w-4 h-4 text-muted-foreground mt-1" />
                        </div>
                    </Link>
                ))}
            </div>

            {total > searchData.length && (
                <div className="p-3 border-t">
                    <Link
                        href={`/search?q=${encodeURIComponent(debouncedQuery)}`}
                        onClick={onResultClick}
                        className="text-xs text-primary hover:underline"
                    >
                        View all {total} results →
                    </Link>
                </div>
            )}
        </div>
    )
}

export function SearchBar() {
    const [query, setQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('') 
    const [isOpen, setIsOpen] = useState(false)

    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const debouncedSetQuery = useMemo(
        () => debounce((value: string) => setDebouncedQuery(value), 300),
        []
    )

    useEffect(() => {
        debouncedSetQuery(query)
        return () => debouncedSetQuery.cancel()
    }, [query, debouncedSetQuery])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsOpen(false)
                inputRef.current?.blur()
            }
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault()
                inputRef.current?.focus()
                setIsOpen(true)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setQuery(value)
        setIsOpen(value.length > 0)
    }

    const handleResultClick = () => {
        setIsOpen(false)
        setQuery('')
        setDebouncedQuery('')
    }

    const clearSearch = () => {
        setQuery('')
        setDebouncedQuery('')
        setIsOpen(false)
        inputRef.current?.focus()
    }

    // Show loading when typing but before debounce completes
    const isTyping = query !== debouncedQuery && query.length > 0

    return (
        <div ref={searchRef} className="relative md:block hidden w-full max-w-2xl">

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search posts..."
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => query.length > 0 && setIsOpen(true)}
                    className="pl-10 pr-20"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    {query && (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={clearSearch}
                        >
                            <X className="w-3 h-3" />
                        </Button>
                    )}
                    <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs bg-muted rounded border">
                        ⌘K
                    </kbd>
                </div>
            </div>

          
            {isOpen && (
                <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-hidden shadow-lg z-50">
                    <CardContent className="p-0">

                        {isTyping && (
                            <div className="flex items-center gap-2 p-4">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm text-muted-foreground">Searching...</span>
                            </div>
                        )}

  
                        {!isTyping && debouncedQuery.length > 0 && (
                            <Suspense 
                                key={debouncedQuery} 
                                fallback={<SearchResultsLoading />}
                            >
                                <SearchResults 
                                    debouncedQuery={debouncedQuery} 
                                    onResultClick={handleResultClick}
                                />
                            </Suspense>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}