import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/ArticleCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SearchBar } from '@/components/SearchBar';
import { apiClient, categories, getCategoryIcon } from '@/lib/api';
import { useState } from 'react';

export default function Category() {
  const { label } = useParams<{ label: string }>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['articles', 'category', label],
    queryFn: () => apiClient.getArticlesByLabel(label!),
    enabled: !!label,
  });

  const category = categories.find(cat => cat.id === label);
  const categoryName = category?.name || label?.charAt(0).toUpperCase() + label?.slice(1) || 'Category';
  const categoryDescription = category?.description || `Articles related to ${categoryName.toLowerCase()}`;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Error Loading Category
          </h1>
          <p className="text-muted-foreground mb-4">
            Unable to load articles for this category. Please try again.
          </p>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link to="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{categoryName}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        <div className="flex items-start space-x-4 mb-6">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl category-${label}`}>
            {getCategoryIcon(label || 'default')}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {categoryName}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {categoryDescription}
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Tag className="h-4 w-4" />
                <span>Label: {label}</span>
              </div>
              {!isLoading && (
                <span>{articles?.length || 0} articles</span>
              )}
            </div>
          </div>
        </div>

        <SearchBar placeholder={`Search ${categoryName.toLowerCase()} documentation...`} />
      </div>

      {/* Articles */}
      <section>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading articles..." />
          </div>
        ) : articles && articles.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {articles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article}
                showExcerpt={viewMode === 'grid'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl mx-auto mb-4 category-${label}`}>
                {getCategoryIcon(label || 'default')}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Articles in {categoryName}
              </h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any articles in this category yet. Check back later or browse other categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link to="/dashboard">Browse All Categories</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/search">Search All Articles</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}