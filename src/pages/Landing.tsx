import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/ArticleCard';
import { CategoryCard } from '@/components/CategoryCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { apiClient, categories } from '@/lib/api';
import heroImage from '@/assets/hero-image.jpg';

export default function Landing() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => apiClient.getArticles(),
  });

  const latestArticles = articles?.slice(0, 6) || [];

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="RAKwireless Knowledge Hub"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              RAKwireless Knowledge Hub
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              Comprehensive documentation for WisBlock, WisDuo, WisGate, and more. 
              Find guides, references, and troubleshooting help for all your RAK devices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link to="/dashboard">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Documentation
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/search">
                  <Zap className="mr-2 h-5 w-5" />
                  Quick Search
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Navigate through our organized documentation sections to find exactly what you need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                articleCount={getCategoryCount(category.id)}
                className="group"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Latest Articles
              </h2>
              <p className="text-lg text-muted-foreground">
                Recently updated documentation and guides
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/dashboard">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading articles..." />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {latestArticles.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found. Check your API connection.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}