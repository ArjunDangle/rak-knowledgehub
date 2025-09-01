// API client for FastAPI backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface Article {
  id: string;
  title: string;
  labels: string[];
  url: string;
  excerpt: string;
}

export interface ArticleDetail extends Article {
  body_html: string;
}

export interface SearchParams {
  q?: string;
  label?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Get all articles
  async getArticles(): Promise<Article[]> {
    return this.get<Article[]>('/articles');
  }

  // Get article by ID
  async getArticle(id: string): Promise<ArticleDetail> {
    return this.get<ArticleDetail>(`/articles/${id}`);
  }

  // Search articles
  async searchArticles(query: string): Promise<Article[]> {
    const encodedQuery = encodeURIComponent(query);
    return this.get<Article[]>(`/search?q=${encodedQuery}`);
  }

  // Get articles by label
  async getArticlesByLabel(label: string): Promise<Article[]> {
    const encodedLabel = encodeURIComponent(label);
    return this.get<Article[]>(`/articles?label=${encodedLabel}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Helper functions for categorizing
export const getCategoryColor = (label: string): string => {
  if (label.includes('hardware')) return 'hardware';
  if (label.includes('firmware')) return 'firmware';
  if (label.includes('support') || label.includes('troubleshooting')) return 'support';
  return 'default';
};

export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'hardware': return '🔧';
    case 'firmware': return '💾';
    case 'support': return '🛠️';
    default: return '📄';
  }
};

export const categories = [
  { id: 'hardware', name: 'Hardware', description: 'WisBlock, WisDuo, WisGate devices and components' },
  { id: 'firmware', name: 'Firmware', description: 'AT commands, guides, and update instructions' },
  { id: 'support', name: 'Support & Troubleshooting', description: 'FAQs, common issues, and solutions' }
];