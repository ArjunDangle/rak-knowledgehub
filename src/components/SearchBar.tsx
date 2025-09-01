import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  autoFocus?: boolean;
}

export function SearchBar({ 
  placeholder = "Search knowledge base...", 
  size = 'md',
  autoFocus = false 
}: SearchBarProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const inputSizeClasses = {
    sm: 'h-9 text-sm',
    md: 'h-10',
    lg: 'h-12 text-lg'
  };

  const buttonSizeClasses = {
    sm: 'h-9 px-3',
    md: 'h-10 px-4',
    lg: 'h-12 px-6'
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 w-full max-w-2xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          className={`pl-10 pr-10 bg-background border-2 border-input hover:border-primary/50 focus:border-primary ${inputSizeClasses[size]}`}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <Button 
        type="submit" 
        disabled={!query.trim()}
        className={buttonSizeClasses[size]}
      >
        Search
      </Button>
    </form>
  );
}