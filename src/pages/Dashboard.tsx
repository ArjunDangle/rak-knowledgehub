import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Grid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/ArticleCard';
import { CategoryCard } from '@/components/CategoryCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SearchBar } from '@/components/SearchBar';
import { apiClient, categories } from '@/lib/api';
import { useState } from 'react';

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => apiClient.getArticles(),
  });

  // Calculate article counts per category
  const getCategoryCount = (categoryId: string) => {
    if (!articles) return 0;
    return articles.filter(article => 
      article.labels.some(label => 
        categoryId === 'support' 
          ? ['support', 'troubleshooting'].includes(label)
          : label === categoryId
      )
    ).length;
  };

  const totalArticles = articles?.length || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Documentation Dashboard
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Browse all {totalArticles} articles in our knowledge base
        </p>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <SearchBar placeholder="Search all documentation..." />
          
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
      </div>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Browse by Category
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              articleCount={getCategoryCount(category.id)}
            />
          ))}
        </div>
      </section>

      {/* All Articles Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            All Articles
          </h2>
          <Link to="/search">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Advanced Search
            </Button>
          </Link>
        </div>

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
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Articles Found
              </h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any articles. This might be due to a connection issue with the API.
              </p>
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}