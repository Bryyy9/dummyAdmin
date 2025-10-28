"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2, FileText, Users, ImageIcon, Code2, BookMarked } from "lucide-react"
import { Input } from "@/components/ui/input"
import { searchService, type SearchResult } from "@/lib/api/search"
import { cn } from "@/lib/utils"

const typeIcons = {
  lexicon: BookMarked,
  reference: FileText,
  asset: ImageIcon,
  contributor: Users,
  codification: Code2,
}

const typeLabels = {
  lexicon: "Lexicon",
  reference: "Reference",
  asset: "Asset",
  contributor: "Contributor",
  codification: "Codification",
}

const typeColors = {
  lexicon: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  reference: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  asset: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  contributor: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  codification: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
}

export function GlobalSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true)
        const searchResults = await searchService.search(query)
        setResults(searchResults)
        setIsLoading(false)
        setIsOpen(true)
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleResultClick = (result: SearchResult) => {
    if (result.url) {
      router.push(result.url)
      setIsOpen(false)
      setQuery("")
    }
  }

  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = []
      }
      acc[result.type].push(result)
      return acc
    },
    {} as Record<string, SearchResult[]>,
  )

  return (
    <div className="flex-1 max-w-md relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search lexicons, references, assets..."
          className="pl-10 bg-muted border-0"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && (results.length > 0 || query.trim()) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {Object.entries(groupedResults).map(([type, typeResults]) => (
                <div key={type} className="mb-3 last:mb-0">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {typeLabels[type as keyof typeof typeLabels]}
                  </div>
                  {typeResults.map((result) => {
                    const Icon = typeIcons[result.type]
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors flex items-start gap-3 group"
                      >
                        <Icon className="w-4 h-4 mt-0.5 text-muted-foreground group-hover:text-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{result.title}</div>
                          {result.description && (
                            <div className="text-xs text-muted-foreground truncate">{result.description}</div>
                          )}
                          {result.category && (
                            <div
                              className={cn(
                                "inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium",
                                typeColors[result.type],
                              )}
                            >
                              {result.category}
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No results found for "{query}"</div>
          )}
        </div>
      )}
    </div>
  )
}
