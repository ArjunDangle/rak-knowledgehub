import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { apiClient, getCategoryColor } from '@/lib/api';

export default function Article() {
  const { id } = useParams<{ id: string }>();
  
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: () => apiClient.getArticle(id!),
    enabled: !!id,
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Article Not Found
          </h1>
          <p className="text-muted-foreground mb-4">
            The article you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading article..." />
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
          {article.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Tag className="h-4 w-4" />
            <span>Labels:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.labels.map((label) => (
              <Badge
                key={label}
                variant="secondary"
                className={`${getCategoryColor(label) !== 'default' ? `category-${getCategoryColor(label)}` : ''}`}
              >
                <Link
                  to={`/categories/${label}`}
                  className="hover:underline"
                >
                  {label}
                </Link>
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Last updated in Confluence</span>
            </div>
          </div>
          
          <Button asChild variant="outline" size="sm">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View in Confluence
            </a>
          </Button>
        </div>
      </header>

      {/* Article Content */}
      <article className="prose-knowledge">
        <div 
          dangerouslySetInnerHTML={{ __html: article.body_html }}
          className="[&>*]:mb-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-primary [&>h1]:mt-8 [&>h1]:mb-4 [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:text-foreground [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-foreground [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:text-muted-foreground [&>p]:leading-relaxed [&>ul]:text-muted-foreground [&>ol]:text-muted-foreground [&>li]:mb-1 [&>code]:bg-muted [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>pre]:bg-muted [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-muted-foreground [&>table]:w-full [&>table]:border-collapse [&>td]:border [&>td]:border-border [&>td]:p-2 [&>th]:border [&>th]:border-border [&>th]:p-2 [&>th]:bg-muted [&>th]:font-semibold [&>img]:rounded-lg [&>img]:shadow-md"
        />
      </article>

      {/* Footer Actions */}
      <footer className="mt-12 pt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Found an issue with this article?{' '}
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Edit it in Confluence
            </a>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" asChild>
              <Link to="/dashboard">Browse More Articles</Link>
            </Button>
            <Button asChild>
              <Link to="/search">Search Documentation</Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}