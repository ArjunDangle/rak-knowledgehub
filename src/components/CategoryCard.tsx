import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCategoryIcon } from '@/lib/api';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string;
  };
  articleCount?: number;
  className?: string;
}

export function CategoryCard({ category, articleCount = 0, className = '' }: CategoryCardProps) {
  return (
    <Link to={`/categories/${category.id}`} className="block">
      <div className={`knowledge-card h-full ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl category-${category.id}`}>
              {getCategoryIcon(category.id)}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {articleCount} {articleCount === 1 ? 'article' : 'articles'}
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {category.description}
        </p>

        <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto text-primary hover:text-primary-hover">
          Browse {category.name.toLowerCase()} →
        </Button>
      </div>
    </Link>
  );
}