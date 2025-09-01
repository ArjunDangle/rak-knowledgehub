import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Filter, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/ArticleCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SearchBar } from '@/components/SearchBar';
import { apiClient } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [hasSearched, setHasSearched] = useState(false);

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['search', query],
    queryFn: () => apiClient.searchArticles(query),
    enabled: !!query.trim(),
  });

  useEffect(() => {
    if (query.trim()) {
      setHasSearched(true);
    }
  }, [query]);

  const resultsCount = searchResults?.length || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Search Documentation
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Find answers across all RAKwireless documentation
          </p>
          
          <div className="max-w-2xl mx-auto">
            <SearchBar 
              placeholder="Search for guides, references, troubleshooting..." 
              size="lg"
              autoFocus={!query}
            />
          </div>
        </div>

        {/* Search Results Header */}
        {hasSearched && (
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              {query && (
                <h2 className="text-xl font-semibold text-foreground">
                  Search results for "{query}"
                </h2>
              )}
              {!isLoading && (
                <p className="text-muted-foreground">
                  {resultsCount === 0 ? 'No results found' : `${resultsCount} ${resultsCount === 1 ? 'result' : 'results'} found`}
                </p>
              )}
            </div>
            
            {query && (
              <div className="text-sm text-muted-foreground">
                <Link to="/search" className="hover:text-foreground transition-colors">
                  Clear search
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Results */}
      <main>
        {!hasSearched && (
          <div className="text-center py-12">
            <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Start Your Search
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Enter keywords, product names, or questions to find relevant documentation across our knowledge base.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              <span className="text-sm text-muted-foreground">Popular searches:</span>
              <Link to="/search?q=RAK4631" className="text-sm text-primary hover:underline">RAK4631</Link>
              <Link to="/search?q=AT+commands" className="text-sm text-primary hover:underline">AT commands</Link>
              <Link to="/search?q=WisGate" className="text-sm text-primary hover:underline">WisGate</Link>
              <Link to="/search?q=troubleshooting" className="text-sm text-primary hover:underline">troubleshooting</Link>
            </div>
          </div>
        )}

        {isLoading && query && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Searching documentation..." />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Search Error
              </h3>
              <p className="text-muted-foreground mb-4">
                Unable to perform search. Please check your connection and try again.
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        )}

        {searchResults && searchResults.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {hasSearched && !isLoading && !error && resultsCount === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Results Found
              </h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any articles matching "{query}". Try different keywords or browse by category.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link to="/dashboard">Browse Categories</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/search">New Search</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}