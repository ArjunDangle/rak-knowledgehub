import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Article, getCategoryColor } from '@/lib/api';

interface ArticleCardProps {
  article: Article;
  showExcerpt?: boolean;
}

export function ArticleCard({ article, showExcerpt = true }: ArticleCardProps) {
  const primaryCategory = article.labels.find(label => 
    ['hardware', 'firmware', 'support', 'troubleshooting'].includes(label)
  ) || 'default';

  return (
    <div className="knowledge-card group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
          <Link to={`/articles/${article.id}`} className="hover:underline">
            {article.title}
          </Link>
        </h3>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
        >
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            title="View in Confluence"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>

      {showExcerpt && article.excerpt && (
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {article.labels.slice(0, 3).map((label) => (
            <Badge
              key={label}
              variant="secondary"
              className={`text-xs ${getCategoryColor(label) !== 'default' ? `category-${getCategoryColor(label)}` : ''}`}
            >
              <Link
                to={`/categories/${label}`}
                className="hover:underline"
              >
                {label}
              </Link>
            </Badge>
          ))}
          {article.labels.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{article.labels.length - 3} more
            </Badge>
          )}
        </div>

        <Link to={`/articles/${article.id}`}>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover">
            Read more
          </Button>
        </Link>
      </div>
    </div>
  );
}